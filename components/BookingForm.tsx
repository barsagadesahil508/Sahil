
import React, { useState, useEffect } from 'react';
import { DAILY_RENTAL_RATE, CURRENCY, CAMERA_MODELS } from '../constants';
import { CameraOrder } from '../types';

interface BookingFormProps {
  onOrder: (order: CameraOrder) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onOrder }) => {
  const [name, setName] = useState('');
  const [camera, setCamera] = useState(CAMERA_MODELS[0].id);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (start && end) {
      const s = new Date(start);
      const e = new Date(end);
      const diffTime = Math.abs(e.getTime() - s.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setTotal(diffDays * DAILY_RENTAL_RATE);
    } else {
      setTotal(0);
    }
  }, [start, end]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !start || !end) return;

    const s = new Date(start);
    const e_date = new Date(end);
    const diffDays = Math.ceil(Math.abs(e_date.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) || 1;

    // Find the camera model from constants to include the name in the order
    const selectedCamera = CAMERA_MODELS.find(m => m.id === camera);

    const newOrder: CameraOrder = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: name,
      // Fix: Added missing cameraName property
      cameraName: selectedCamera?.name || 'Standard Pro Camera',
      startDate: start,
      endDate: end,
      days: diffDays,
      totalBill: diffDays * DAILY_RENTAL_RATE,
      status: 'pending'
    };
    onOrder(newOrder);
    setName('');
    setStart('');
    setEnd('');
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400">Book Your Gear</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 outline-none"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Select Camera</label>
          <select
            value={camera}
            onChange={(e) => setCamera(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            {CAMERA_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              required
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              required
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>
        </div>

        <div className="p-4 bg-cyan-950/30 border border-cyan-800/50 rounded-lg">
          <div className="flex justify-between items-center text-lg font-semibold text-cyan-200">
            <span>Estimated Bill:</span>
            <span>{CURRENCY}{total}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Rate: {CURRENCY}{DAILY_RENTAL_RATE} per day</p>
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/20"
        >
          Confirm Order
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
