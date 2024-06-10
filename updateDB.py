import numpy as np
import requests
import pandas as pd
import re
from typing import Dict
import json
from time import time, sleep
import redis
import numpy as np


from datetime import datetime 

import psycopg2

import os
from dotenv import load_dotenv
from threading import Thread


load_dotenv("/Users/lornebarnaby/code/comptotal/frontend/.env")
pg_uri = os.getenv('DATABASE_URL').split('?')[0]



def fetchComp(message):
    """Called whenever a message is published"""
    compId = int(message['data'].decode())
    print('got', compId)
    with psycopg2.connect(pg_uri) as conn:
        with conn.cursor() as cursor: 
            cursor.execute('SELECT * FROM "BwlComp" WHERE id=%s', (compId,))
            rows = cursor.fetchone()

        eventId = rows[5].split('/')[-1]
        fixed_lifter_data = update_event(compId, eventId)
        print(fixed_lifter_data[:2])
        with conn.cursor() as cursor:
            for lifter in fixed_lifter_data:
                insert_query = """
                    INSERT INTO \"BwlCompLifter\" (name, club, category, lifterid, \"bwlCompId\")
                    VALUES (%s, %s, %s, %s, %s) ON CONFLICT DO NOTHING
                """
                cursor.execute(insert_query, (lifter['name'], lifter['club'], lifter['cat'], lifter['id'], compId,))
        with conn.cursor() as cursor:
            update_query = """
                UPDATE \"BwlComp\" SET \"updatedAt\" = NOW() WHERE id=%s
            """
            cursor.execute(update_query, (compId,))

    r.publish(str(compId),'done')
        


def getLiftersOW():
    while True:
        with psycopg2.connect(pg_uri) as conn:
            with conn.cursor() as cursor: 
                select = 'SELECT name from "BwlCompLifter" WHERE owurl IS NULL LIMIT 5'
                cursor.execute(select, ())
                rows = cursor.fetchall()
            print(rows)
            for l in rows:
                name = l[0]
                res = requests.get(f"https://api.openweightlifting.org/search?name={name}&limit=5")
                url = "?"
                possib = res.json()['names']

                
                if(len(possib) > 0 and any(p['Name'] == name and p['Federation'] == "UK" for p in possib)):
                    url = f"https://www.openweightlifting.org/lifter?name={name}&federation=UK"

                print(url)
                with conn.cursor() as cursor: 
                    upd = 'UPDATE "BwlCompLifter" SET owurl = %s WHERE name = %s'
                    cursor.execute(upd, (url, name, ))

                conn.commit() 
            
        sleep(2.0)


def getStats():
    while True:
        with psycopg2.connect(pg_uri) as conn:
            with conn.cursor() as cursor: 
                select = 'SELECT name from "BwlCompLifter" WHERE owurl IS NOT NULL AND owurl <> \'?\' and num_comps IS NULL LIMIT 5'
                cursor.execute(select, ())
                rows = cursor.fetchall()
            print(rows)
            for l in rows:
                name = l[0]
                res = requests.get(f"https://api.openweightlifting.org/history?name={name}&federation=UK")

                if(res.status_code != 200):
                    continue
                hist = res.json()
                stats = hist['stats']
                prior = len(hist['lifts'])

                
                with conn.cursor() as cursor: 
                    upd = 'UPDATE "BwlCompLifter" SET best_cj = %s, best_snatch = %s, best_total=%s, num_comps = %s WHERE name = %s'
                    cursor.execute(upd, (stats['best_cj'], stats['best_snatch'], stats['best_total'], prior, name, ))

                conn.commit()
                print(name, stats)


        sleep(5.0)
        
if __name__ == "__main__":
    # Redis connection
    r = redis.Redis(host='localhost', port=6379, db=0)

    # Subscribe to notifications and register callback for when messages arrive
    pubsub = r.pubsub(ignore_subscribe_messages=True)
    pubsub.subscribe(**{'fetches': fetchComp})

    # Start a background message receiver
    # See https://redis.readthedocs.io/en/stable/advanced_features.html
    thread = pubsub.run_in_thread(sleep_time=0.001)


    checker = Thread(target=getLiftersOW)
    checker.start()

    checker2 = Thread(target=getStats)
    checker2.start()


def add_gender(fil, items):
    for item in items:
        item['text'] = fil['placeholder'].split(' ')[1][0].upper() + item['text']
    return items


def update_event(comp_id, event_id):
    sport80_backend = "https://bwl.sport80.com"
    res = requests.post(f"{sport80_backend}/api/public/events/datatable/{comp_id}/entries/{event_id}").json()
    data_url = sport80_backend +res['data_url']

    filters = res['filters']
    is_bw_cat = lambda f: "'" in f['placeholder']

    bw_filters = list((map(
        lambda x: add_gender(x, x['items']), filter(
            is_bw_cat, filters
            ))))

    filter_names = list((map(
        lambda x: x['name'], filter(
            is_bw_cat
            , filters
            ))))

    filterdicts = list(map(parse_filters,bw_filters))
    joined = dict(list(zip(filter_names,filterdicts)))
    joined
    fixed_lifters = get_lifters(joined, data_url)
    return fixed_lifters

    

def parse_filters(bw_filter):
    digits = r'\d+'
    parse_name = lambda n: [n.split(" ")[0], re.findall(digits, "".join(n.split(" ")[1:]))[0]] 
    valid = lambda parsed_name: len(parsed_name) == 2
    not_zero = lambda parsed_name: int(parsed_name[1]) > 0

    parsed = []
    for f in bw_filter:
        parsed_name = parse_name(f['text'])
        if valid(parsed_name) and not_zero(parsed_name):
            parsed.append([parsed_name[0], f['value']])
    

    cat_filters = {cat:filter_id for cat, filter_id in parsed}
    return cat_filters

def fix_lifters(lifter_data, bw_cat):
    assert 'data' in lifter_data
    data = lifter_data['data']
    for lifter in data:
        lifter['cat'] = bw_cat
    return data


def get_lifters(filterdict : Dict[str, Dict[str, int]], data_url : str):
    all_lifters = []
    for filter_name, filters in filterdict.items():
        for bw_cat, filter_id in filters.items():
            # print(filter_name, bw_cat, filter_id)
            jsondata = json.dumps({
                "columns":[],
                "filters":{filter_name:[filter_id]}}
                ) 
            
            res = requests.post(data_url, data = jsondata)
            if res.status_code == 200:
                lifters = fix_lifters(res.json(), bw_cat)
                all_lifters += lifters
        
    return all_lifters

