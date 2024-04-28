// Fetch.tsx
import React, { useState, useEffect } from 'react';
import CreateSlotPopup from "../Services/CreateSlot";
import data from "../../assets/data.json"; // Ensure this path is correct

export interface Slot {
  id: number;
  topic: string;
  startTime: Date;
  endTime: Date;
  title: string;
  ZoomLink: string;  // Assuming Zoom links are part of slots for consistency
}

export interface Meeting {
  id: number;
  name: string;
  topic: string;
  title: string;
  description: string;  // Added missing description property
  startTime: string;
  endTime: string;
  ZoomLink: string;
}

interface Props {
  children: (
    slots: Slot[],
    upcomingMeetings: Meeting[],
    handleEditSlot: (id: number) => void,
    handleDeleteSlot: (id: number) => void,
    handleDeleteMeeting: (id: number) => void,
    setIsCreatePopupOpen: (isOpen: boolean) => void,
    handleAddToCalendarMeeting: (id: number) => void,
    handleJoinMeeting: (id: number) => void
  ) => JSX.Element;
}

const Fetch: React.FC<Props> = ({ children }) => {
  const [slotss, setSlots] = useState<Slot[]>([]);
  const [editSlotData, setEditSlotData] = useState<Slot | null>(null);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState<boolean>(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState<boolean>(false);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false); // Define loading state
  const [error, setError] = useState(""); // Define error state

  useEffect(() => {
    const formattedSlots = data.slots.map(slot => ({
      ...slot,
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime),
      zoomLink: "" // Add the missing zoomLink property
    }));
    setSlots(formattedSlots);
    setUpcomingMeetings(data.upcomingMeetings.map((meeting: any) => ({
      ...meeting,
      description: "", // Add the missing description property
      zoomLink: "" // Add the missing zoomLink property
    })));
  }, []);

  const handleCreateSlot = (topic: string, startDate: Date, endDate: Date, title: string) => {
    const newSlot: Slot = {
      id: Date.now(),
      topic,
      startTime: startDate,
      endTime: endDate,
      title,
      ZoomLink: "" // Add the missing zoomLink property
    };
    setSlots(currentSlots => [...currentSlots, newSlot]);
    setIsCreatePopupOpen(false);
  };

  const handleEditSlot = (_id: number) => {
    const slotToEdit = slots.find(slot => slot._id === _id);
    if (slotToEdit) {
      setEditSlotData(slotToEdit); // This now includes all the data needed for editing, including the ID
      setIsEditPopupOpen(true);
    }
  };
  

  const handleUpdateSlot = (topic: string, startDate: Date, endDate: Date, title: string) => {
    const updatedSlots = slots.map(slot =>
      slot.id === editSlotData?.id ? { ...slot, topic, startTime: startDate, endTime: endDate, title } : slot
    );
    setSlots(updatedSlots);
    setEditSlotData(null);
    setIsEditPopupOpen(false);
  };

  const handleDeleteSlot = (id: number) => {
    setSlots(currentSlots => currentSlots.filter(slot => slot.id !== id));
  };

  const handleDeleteMeeting = (id: number) => {
    setUpcomingMeetings(currentMeetings => currentMeetings.filter(meeting => meeting.id !== id));
  };
  

  const handleAddToCalendarMeeting = (id: number) => {
    const meeting = upcomingMeetings.find(m => m.id === id);
    if (meeting) {
      const { title, description, startTime, endTime, ZoomLink } = meeting;
      const startDateTime = new Date(startTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
      const endDateTime = new Date(endTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
  
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(description + " Join Zoom Meeting: " + ZoomLink)}&sf=true&output=xml`;
      
      window.open(googleCalendarUrl, '_blank');
    } else {
      console.error('Meeting not found with ID:', id);
    }
  }

  const handleJoinMeeting = (id: number) => {
    const meeting = upcomingMeetings.find(m => m.id === id);
    if (meeting) {
      window.open(meeting.ZoomLink, '_blank');
    } else {
      console.error('Meeting not found with ID:', id);
    }
  }

  return (
    <>
      {children(slotss, upcomingMeetings, handleEditSlot, handleDeleteSlot, handleDeleteMeeting, setIsCreatePopupOpen, handleAddToCalendarMeeting, handleJoinMeeting)}
      {isCreatePopupOpen && (
        <CreateSlotPopup
          isOpen={isCreatePopupOpen}
              onClose={() => setIsCreatePopupOpen(false)}
              onCreateSlot={handleCreateSlot}
            />
          )}
              </>
            );
          };

export default Fetch;
