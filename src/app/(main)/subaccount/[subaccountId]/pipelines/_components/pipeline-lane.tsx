"use client";
import CreateLaneForm from "@/components/forms/lane-form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteLane, saveActivityLogsNotification } from "@/libs/queries";
import { LaneDetail, TicketWithTags } from "@/libs/types";
import { cn } from "@/libs/utils";
import { useModal } from "@/providers/modal-provider";
import { Edit, MoreVertical, PlusCircleIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useMemo } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import CustomModal from "@/components/global/custom-modal";
import PipelineTicket from "./pipeline-ticket";
import TicketForm from "@/components/forms/ticket-form";

interface PipelaneLaneProps {
  setAllTickets: Dispatch<SetStateAction<TicketWithTags>>;
  allTickets: TicketWithTags;
  tickets: TicketWithTags;
  pipelineId: string;
  laneDetails: LaneDetail;
  subaccountId: string;
  index: number;
}

const PipelineLane: React.FC<PipelaneLaneProps> = ({
  setAllTickets,
  tickets,
  pipelineId,
  laneDetails,
  subaccountId,
  allTickets,
  index,
}) => {
  const { setOpen } = useModal();
  const router = useRouter();

  const amt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  });

  const laneAmt = useMemo(() => {
    console.log(tickets);
    return tickets.reduce(
      (sum, ticket) => sum + (Number(ticket?.value) || 0),
      0,
    );
  }, [tickets]);

  const randomColor = `#${Math.random().toString(16).slice(2, 8)}`;

  const addNewTicket = (ticket: TicketWithTags[0]) => {
    setAllTickets([...allTickets, ticket]);
  };

  const handleCreateTicket = () => {
    setOpen(
      <CustomModal
        title="Create A Ticket"
        subheading="Tickets are a great way to keep track of tasks"
      >
        <TicketForm
          getNewTicket={addNewTicket}
          laneId={laneDetails.id}
          subaccountId={subaccountId}
        />
      </CustomModal>,
    );
  };

  const handleEditLane = () => {
    setOpen(
      <CustomModal title="Edit Lane Details" subheading="">
        <CreateLaneForm pipelineId={pipelineId} defaultData={laneDetails} />
      </CustomModal>,
    );
  };

  const handleDeleteLane = async () => {
    try {
      const response = await deleteLane(laneDetails.id);
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a lane | ${response?.name}`,
        subaccountId,
      });
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Draggable
      draggableId={laneDetails.id.toString()}
      index={index}
      key={laneDetails.id}
    >
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          //@ts-ignore
          const offset = { x: 300, y: 0 };
          //@ts-ignore
          const x = provided.draggableProps.style?.left - offset.x;
          //@ts-ignore
          const y = provided.draggableProps.style?.top - offset.y;
          //@ts-ignore
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            top: y,
            left: x,
          };
        }
        return (
          <div
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="h-full"
          >
            <AlertDialog>
              <DropdownMenu>
                <div className="relative h-[700px]  w-[300px] flex-shrink-0 overflow-visible rounded-lg bg-slate-200/30 px-4 dark:bg-background/20 ">
                  <div
                    {...provided.dragHandleProps}
                    className=" absolute left-0 right-0 top-0  z-10 h-14 bg-slate-200/60 backdrop-blur-lg dark:bg-background/40 "
                  >
                    <div className="flex h-full cursor-grab items-center justify-between border-b-[1px] p-4 ">
                      <div className="flex w-full items-center gap-2">
                        <div
                          className={cn("h-4 w-4 rounded-full")}
                          style={{ background: randomColor }}
                        />
                        <span className="text-sm font-bold">
                          {laneDetails.name}
                        </span>
                      </div>
                      <div className="flex flex-row items-center">
                        <Badge className="bg-white text-black">
                          {amt.format(laneAmt)}
                        </Badge>
                        <DropdownMenuTrigger>
                          <MoreVertical className="cursor-pointer text-muted-foreground" />
                        </DropdownMenuTrigger>
                      </div>
                    </div>
                  </div>

                  <Droppable
                    droppableId={laneDetails.id.toString()}
                    key={laneDetails.id}
                    type="ticket"
                  >
                    {(provided) => (
                      <div className="max-h-[700px] pt-12">
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="mt-2"
                        >
                          {tickets.map((ticket, index) => (
                            <PipelineTicket
                              allTickets={allTickets}
                              setAllTickets={setAllTickets}
                              subaccountId={subaccountId}
                              ticket={ticket}
                              key={ticket.id.toString()}
                              index={index}
                            />
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>

                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger className="w-full">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Trash size={15} />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={handleEditLane}
                    >
                      <Edit size={15} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={handleCreateTicket}
                    >
                      <PlusCircleIcon size={15} />
                      Create Ticket
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </div>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={handleDeleteLane}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </DropdownMenu>
            </AlertDialog>
          </div>
        );
      }}
    </Draggable>
  );
};

export default PipelineLane;
