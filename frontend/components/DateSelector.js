import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';

export default function DateSelector({ currentDate, onDateChange }) {
  const [showCalendar, setShowCalendar] = useState(false);

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const handleCalendarDateSelect = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onDateChange(newDate);
    setShowCalendar(false);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevDay}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiChevronLeft size={24} />
        </button>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-800">{formatDate(currentDate)}</h2>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="p-2 hover:bg-primary-100 rounded-lg transition-colors text-primary-600"
              title="Open calendar"
            >
              <FiCalendar size={24} />
            </button>
          </div>
          <button
            onClick={handleToday}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Today
          </button>

          {/* Calendar Popup */}
          {showCalendar && (
            <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-96">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <FiChevronLeft size={20} />
                </button>
                <h3 className="font-semibold text-gray-800">{monthYear}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      handleToday();
                      setShowCalendar(false);
                    }}
                    className="p-1 hover:bg-primary-100 rounded-lg text-primary-600 font-semibold text-xs"
                    title="Go to today"
                  >
                    Today
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day && handleCalendarDateSelect(day)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      day === null
                        ? 'opacity-0 cursor-default'
                        : day === currentDate.getDate()
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    disabled={day === null}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleNextDay}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
