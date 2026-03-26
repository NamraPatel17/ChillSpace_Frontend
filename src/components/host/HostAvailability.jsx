import { Calendar as CalendarIcon, Trash2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { CustomSelect } from "../../components/ui/custom-select";
import { AvailabilityCalendar } from "../../components/ui/AvailabilityCalendar";
import { toast } from "react-toastify";

export default function HostAvailability() {
  const [loading, setLoading] = useState(true);
  const [hostProperties, setHostProperties] = useState([]);
  const [selectedPropId, setSelectedPropId] = useState("");
  const [availability, setAvailability] = useState({ blockedRanges: [], merged: [] });
  const [blockRange, setBlockRange] = useState({ start: null, end: null, reason: "Maintenance" });

  const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchHostProperties = async () => {
      try {
        const res = await axios.get(`/properties?hostId=${userId}`);
        setHostProperties(res.data);
        if (res.data.length > 0) {
          setSelectedPropId(res.data[0]._id);
        }
      } catch (err) {
        console.error("Failed to load host properties", err);
        toast.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };
    fetchHostProperties();
  }, [userId]);

  useEffect(() => {
    if (selectedPropId) {
      const fetchAvailability = async () => {
        try {
          const res = await axios.get(`/properties/${selectedPropId}/availability`);
          setAvailability(res.data);
        } catch (err) {
          console.error("Failed to load availability", err);
        }
      };
      fetchAvailability();
    }
  }, [selectedPropId]);

  const handleBlockDates = async () => {
    if (!blockRange.start || !blockRange.end) {
      toast.error("Please select a date range first");
      return;
    }
    try {
      await axios.post(`/properties/${selectedPropId}/availability`, {
        startDate: blockRange.start,
        endDate: blockRange.end,
        reason: blockRange.reason
      }, { headers });
      
      toast.success("Dates blocked successfully");
      // Refresh
      const res = await axios.get(`/properties/${selectedPropId}/availability`);
      setAvailability(res.data);
      setBlockRange({ start: null, end: null, reason: "Maintenance" });
    } catch (err) {
      toast.error("Failed to block dates");
    }
  };

  const handleUnblock = async (rangeId) => {
    try {
      await axios.delete(`/properties/${selectedPropId}/availability/${rangeId}`, { headers });
      toast.success("Dates unblocked");
      // Refresh
      const res = await axios.get(`/properties/${selectedPropId}/availability`);
      setAvailability(res.data);
    } catch (err) {
      toast.error("Failed to unblock");
    }
  };

  if (loading) return <div className="p-6">Loading availability management...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Property Calendar</h1>
          <p className="mt-1 text-sm text-gray-600">Manage blocked dates and view availability for your listings</p>
        </div>
        {hostProperties.length > 0 && (
          <div className="w-full md:w-64">
            <CustomSelect 
              options={hostProperties.map(p => p.title)}
              value={hostProperties.find(p => p._id === selectedPropId)?.title || ""}
              onChange={(val) => {
                const id = hostProperties.find(p => p.title === val)?._id;
                setSelectedPropId(id);
              }}
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {!selectedPropId ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
            <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No properties found. List a property first to manage availability.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-4 rounded-xl">
              <AvailabilityCalendar 
                isHost={true}
                unavailableDates={availability.merged}
                onRangeSelect={(start, end) => setBlockRange(prev => ({ ...prev, start, end }))}
                initialRange={{
                  start: blockRange.start ? new Date(blockRange.start) : null,
                  end: blockRange.end ? new Date(blockRange.end) : null
                }}
              />
            </div>
            
            <div className="space-y-8">
              <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Plus className="h-4 w-4 mr-2 text-indigo-600" />
                  Block New Dates
                </h3>
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Start Date</p>
                         <p className="text-sm font-medium text-gray-700 p-2 bg-gray-50 rounded border border-gray-100">
                           {blockRange.start ? new Date(blockRange.start).toLocaleDateString() : "Select on calendar"}
                         </p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">End Date</p>
                         <p className="text-sm font-medium text-gray-700 p-2 bg-gray-50 rounded border border-gray-100">
                           {blockRange.end ? new Date(blockRange.end).toLocaleDateString() : "Select on calendar"}
                         </p>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reason for Blocking</p>
                      <input 
                        type="text" 
                        value={blockRange.reason}
                        onChange={(e) => setBlockRange(prev => ({ ...prev, reason: e.target.value }))}
                        className="w-full text-sm bg-white border border-gray-200 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        placeholder="e.g. Personal Use, Maintenance"
                      />
                   </div>
                   <button 
                     onClick={handleBlockDates}
                     disabled={!blockRange.start || !blockRange.end}
                     className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 shadow-md shadow-indigo-100"
                   >
                     Confirm Date Block
                   </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Manage Blocked Ranges</h3>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                   {availability.blockedRanges.length === 0 ? (
                     <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                       <p className="text-sm text-gray-400">No active manual blocks.</p>
                     </div>
                   ) : (
                     availability.blockedRanges.map(range => (
                       <div key={range.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-colors">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <CalendarIcon className="h-5 w-5" />
                             </div>
                             <div>
                                <p className="text-sm font-semibold text-gray-900">{range.reason || "Blocked"}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(range.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(range.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                             </div>
                          </div>
                          <button 
                            onClick={() => handleUnblock(range.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Remove block"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                       </div>
                     ))
                   )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
