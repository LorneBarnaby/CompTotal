'use client'
import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import { useForm, SubmitHandler } from "react-hook-form"
import {createCompetition} from "@/app/api/controllers/competition/route";
import {useRouter} from "next/navigation";


type FormInputs = {
    name: string
    date: Date
}

export default function NewCompModal() {
  const {isOpen, onOpen, onOpenChange, onClose:closeModal} = useDisclosure();
    const router = useRouter();

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInputs>()
    const onSubmit = handleSubmit((data) => {
        console.log(data);

        fetch('api/controllers/competition', {
            method:'POST',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            }
        }).then(() => {
            router.refresh();
            closeModal();
        })
        // createCompetition(data).then((e) => {
        //     console.log(e);
        //     closeModal();
        // })
        // closeModal();

    })


  return (
    <>
      <Button onPress={onOpen} color="primary" className="float-right mr-0">Add Competition</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
      >

        <ModalContent>
          {(onClose) => (
              <>
              <form onSubmit={onSubmit}>
                  <ModalHeader className="flex flex-col gap-1">New Competition</ModalHeader>
                  <ModalBody>
                      <Input
                          autoFocus
                          label="Name"
                          placeholder=""
                          variant="bordered"
                          {...register("name",{ required: true })} isRequired={true}
                      />
                      <Input
                          label="Start Date"
                          type="date"
                          variant="bordered"
                          {...register("date")}
                      />
                  </ModalBody>
                  <ModalFooter>
                      {errors.exampleRequired && <span>This field is required</span>}
                      <Button color="danger" variant="flat" onPress={onClose}>
                          Cancel
                      </Button>
                      <Button type={"submit"} color="primary" >
                          Confirm
                      </Button>

                  </ModalFooter>
              </form>
              </>

              )}

              </ModalContent>
              </Modal>
              </>
              );
          }
