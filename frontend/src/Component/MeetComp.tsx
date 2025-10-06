import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface MeetProps {
    theoremName: string;
    teacherName: string;
    onJoin?: () => void;
    onDetails?: () => void;
}

const MeetComp: React.FC<MeetProps> = ({

    theoremName,
    teacherName,
    // onJoin,
    // onDetails,
}) => {
    const navigate = useNavigate();
    return (
        <div className="bg-gray-800 shadow-lg rounded-xl p-5 w-full max-w-md mx-auto my-4 flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0 py-10">

            {/* Profile Icon + Text Info */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="bg-gray-700 rounded-full p-3 flex-shrink-0">
                    <FaUserCircle size={50} className="text-white" />
                </div>

                <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-white">{theoremName}</h2>
                    <p className="text-gray-300 text-sm mt-1 sm:mt-0">Teacher: {teacherName}</p>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                <button
                    onClick={() => { navigate("/meeting") }}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
                >
                    Join Now
                </button>
                {/* <button
                    onClick={()=>}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
                >
                    Details
                </button> */}
            </div>
        </div>
    );
};

export default MeetComp;
