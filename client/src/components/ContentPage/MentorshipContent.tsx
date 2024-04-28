import React, { useState, useEffect } from "react";
import createAPIInstance from "../../utils/apiService";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Fetch from "../Services/fetch";
import EditSlotPopup from "../Services/EditSlot";

const MentorshipContentPage: React.FC = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const [bookSlots, setBookSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    fetchSlots();
  }, [token]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const endpoint = '/api/mentorship/mentorshipslots'; // Adjust the URL based on your configuration
      const response = await createAPIInstance(token).get(endpoint);
      setSlots(response.data); // Store the response data in state
    } catch (error) {
      setError("Failed to fetch slots. Please try again.");
      console.error('Error fetching slots:');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlots = async (slotId: number) => {
    console.log(slotId);
    try {
      await createAPIInstance(token).delete(`/api/mentorship/mentorshipslots/${slotId}`);
      setSlots(slots => slots.filter(slot => slot.meeting_ID !== slotId));
    } catch (error) {
      console.error('Error deleting slot:', error);
    }
  };

  const formatDateAndTime = (isoDateString) => {
    const date = new Date(isoDateString);
  
    // Extracting components from the date
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 because months are zero indexed
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours();
    let minutes = date.getMinutes();
  
    // Ensure minutes are always treated as an integer
    minutes = Math.floor(minutes);
  
    // Formatting the output to not pad minutes with leading zero
    return `Date: ${year}-${month}-${day} Time: ${hour}:${minutes}`;
  };
  

  const formatDateAndTimea = (isoDateString) => {
    const date = new Date(isoDateString);
  
    // Extracting components from the date
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 because months are zero indexed
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    // Formatting the output
    return `${year}-${month}-${day} ${hour}:${minutes}PM`;
  };
  

  return (
    <div className="">
      {/* Your Slots section */}
      <Fetch>
        {(slotss, upcomingMeetings, handleEditSlot, handleDeleteSlot, handleDeleteMeeting, setIsCreatePopupOpen, handleAddToCalanderMeeting, handleJoinMeeting) => (
          <div className="">
            {/* Slots Display and Manipulation */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Slots</h2>
              <div className="flex items-center mb-4 gap-2">
                {slots.length > 0 ? (
                  slots.map((slot) => (
                    <div key={slot._id} className=" border-2 rounded-xl bg-rose-100 items-center mb-4 w-full md:w-1/2 lg:w-1/3 p-2">
                      <div>
                        <h3 className="text-base font-semibold">Topic: {slot.slot_Topic}</h3>
                        <p className="text-sm text-gray-600">
                        {formatDateAndTime(slot.slot_StartTime)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Duration: {(slot.slot_Duration).toLocaleString()}Mins
                        </p>
                      </div>
                      <div>
                        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300" onClick={() => handleDeleteSlots(slot.meeting_ID)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No slots available. Try adding some!</p>
                )}
                
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-300" onClick={() => setIsCreatePopupOpen(true)}>
                  Create New Slot
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h2 className="text-xl font-semibold mb-2">Upcoming Meetings</h2>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="col-span-2">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="w-1/4 font-semibold">Name</div>
                      <div className="w-1/4 font-semibold">Topic</div>
                      <div className="w-1/4 font-semibold">Title</div>
                      <div className="w-1/4 font-semibold">Time</div>
                    </div>
                    {upcomingMeetings.map((meeting) => (
                      <div key={meeting.id} className="flex items-center mb-4">
                        <div className="w-1/4">{meeting.name}</div>
                        <div className="w-1/4">{meeting.topic}</div>
                        <div className="w-1/4">{meeting.title}</div>
                        <div className="w-1/4">{formatDateAndTimea(meeting.startTime.toLocaleString())}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col mt-12">
                  {upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center mb-2 justify-end">
                      <button className=" w-4/12 btn btn-error mr-1" onClick={() => handleDeleteMeeting(meeting.id)}>Delete</button>
                      <button className="w-4/12 btn btn-warning mr-1" onClick={() => handleAddToCalanderMeeting(meeting.id)}>Add To Calendar</button>
                      <button className="w-4/12 btn btn-accent" onClick={() => handleJoinMeeting(meeting.id)}>Join Meeting</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Book Slots section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h2 className="text-xl font-semibold mb-2">Book Slots</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="col-span-2">
                  <div className="flex gap-2">
                    {slots.map((slot) => (
                    <div key={slot.id} className="border-2 rounded-xl bg-rose-100 flex items-center mb-4 w-full md:w-1/2 p-2">
                      <div>
                        <h3 className="text-base font-semibold">Topic: {slot.slot_Topic}</h3>
                        <p className="text-sm text-gray-600">
                        {formatDateAndTime(slot.slot_StartTime)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Duration: {(slot.slot_Duration).toLocaleString()}Mins
                        </p>
                      </div>
                      <div key={slot.id} className="flex items-center mb-2 justify-end">
                      <button className=" btn btn-accent">Book</button>
                    </div>
                    </div>
                  ))}
                  </div>
                </div>
                <div className="flex flex-col mt-12">
                  {bookSlots.map((slot) => (
                    <div key={slot.id} className="flex items-center mb-2 justify-end">
                      <button className=" btn btn-accent">Book</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Fetch>
    </div>
  );
};

export default MentorshipContentPage;
