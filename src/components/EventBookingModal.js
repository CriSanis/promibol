import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../store/slices/bookingsSlice';
import { showNotification } from '../store/slices/uiSlice';

const ticketTypesByCategory = {
  'Concierto': [
    { label: 'General', price: 50 },
    { label: 'VIP', price: 120 },
    { label: 'Platea', price: 80 }
  ],
  'Teatro': [
    { label: 'General', price: 40 },
    { label: 'Palco', price: 90 },
    { label: 'Platea', price: 60 }
  ],
  'Danza': [
    { label: 'General', price: 30 },
    { label: 'Preferencial', price: 60 }
  ],
  'Feria': [
    { label: 'Ingreso', price: 20 }
  ],
  'Literatura': [
    { label: 'Entrada', price: 25 }
  ],
  'Pintura': [
    { label: 'Entrada', price: 25 }
  ],
  'Artesanía': [
    { label: 'Ingreso', price: 15 }
  ]
};

const iconByCategory = {
  'Concierto': '🎵',
  'Teatro': '🎭',
  'Danza': '💃',
  'Feria': '🛍️',
  'Literatura': '📚',
  'Pintura': '🖼️',
  'Artesanía': '🧶'
};

const validateCardNumber = (number) => /^\d{16}$/.test(number.replace(/\s/g, ''));
const validateExpiry = (expiry) => /^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry);
const validateCVC = (cvc) => /^\d{3,4}$/.test(cvc);

const EventBookingModal = ({ isOpen, onClose, event }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [ticketType, setTicketType] = useState(ticketTypesByCategory[event.category]?.[0]?.label || 'General');
  const [quantity, setQuantity] = useState(1);
  const [seat, setSeat] = useState('');
  const [form, setForm] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardName: ''
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const ticketOptions = ticketTypesByCategory[event.category] || [{ label: 'General', price: 30 }];
  const selectedTicket = ticketOptions.find(t => t.label === ticketType) || ticketOptions[0];
  const totalPrice = selectedTicket.price * quantity;

  const handlePay = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      if (!validateCardNumber(form.cardNumber)) {
        setError('Número de tarjeta inválido. Deben ser 16 dígitos.');
        return;
      }
      if (!validateExpiry(form.expiry)) {
        setError('Fecha de expiración inválida. Usa MM/AA.');
        return;
      }
      if (!validateCVC(form.cvc)) {
        setError('CVC inválido.');
        return;
      }
      if (!form.cardName) {
        setError('El nombre en la tarjeta es obligatorio.');
        return;
      }
    }
    setError(null);
    setProcessing(true);
    setTimeout(async () => {
      await dispatch(createBooking({
        event_id: event.id,
        event_title: event.title,
        event_date: event.date,
        event_location: event.location,
        ticket_type: ticketType,
        quantity,
        seat,
        client_id: user.id,
        status: 'confirmed',
        payment_method: paymentMethod,
        total_price: totalPrice
      }));
      setProcessing(false);
      setStep(3);
      dispatch(showNotification({ type: 'success', message: '¡Reserva confirmada! Recibirás tu entrada por email.' }));
    }, 2000);
  };

  const closeAndReset = () => {
    setStep(1);
    setPaymentMethod('card');
    setTicketType(ticketOptions[0].label);
    setQuantity(1);
    setSeat('');
    setForm({ cardNumber: '', expiry: '', cvc: '', cardName: '' });
    setError(null);
    setProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-lg relative animate-fadeIn">
        <button onClick={closeAndReset} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        {/* Resumen del evento */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
          <img src={event.image} alt={event.title} className="w-32 h-32 object-cover rounded-xl border-4 border-orange-300 shadow-md" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{iconByCategory[event.category] || '🎫'}</span>
              <span className="text-lg font-bold text-orange-700">{event.category}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{event.title}</h2>
            <div className="text-gray-600 text-sm mb-1">{event.date} - {event.location}</div>
            <div className="text-gray-700 text-sm line-clamp-2">{event.description}</div>
          </div>
        </div>
        {step === 1 && (
          <form onSubmit={() => setStep(2)}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tipo de Boleto</label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={ticketType}
                onChange={e => setTicketType(e.target.value)}
              >
                {ticketOptions.map(opt => (
                  <option key={opt.label} value={opt.label}>{opt.label} ({opt.price} Bs)</option>
                ))}
              </select>
            </div>
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Cantidad</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Math.min(10, Number(e.target.value))))}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              {(event.category === 'Teatro' || event.category === 'Concierto') && (
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Asiento (opcional)</label>
                  <input
                    type="text"
                    value={seat}
                    onChange={e => setSeat(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Ej: Fila B, Asiento 12"
                  />
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Resumen</label>
              <div className="bg-orange-50 rounded-lg p-3 text-orange-800 font-semibold flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span>{quantity} x {ticketType}</span>
                <span>Total: <span className="text-lg font-bold">{totalPrice} Bs</span></span>
              </div>
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-full hover:bg-orange-600 transition-colors mt-2">Continuar al Pago</button>
          </form>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-orange-700 mb-4">Elige tu método de pago</h2>
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                className={`flex-1 py-2 rounded-full font-bold border-2 ${paymentMethod === 'card' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-orange-700 border-orange-300'}`}
                onClick={() => setPaymentMethod('card')}
              >
                Tarjeta
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-full font-bold border-2 ${paymentMethod === 'qr' ? 'bg-yellow-400 text-orange-900 border-yellow-400' : 'bg-white text-yellow-700 border-yellow-300'}`}
                onClick={() => setPaymentMethod('qr')}
              >
                Pago por QR
              </button>
            </div>
            {paymentMethod === 'card' && (
              <form onSubmit={handlePay}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Número de Tarjeta</label>
                  <input type="text" name="cardNumber" value={form.cardNumber} onChange={e => setForm(f => ({ ...f, cardNumber: e.target.value }))} maxLength={16} className="w-full px-4 py-2 border rounded-lg" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Expiración (MM/AA)</label>
                    <input type="text" name="expiry" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} maxLength={5} className="w-full px-4 py-2 border rounded-lg" placeholder="08/27" required />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">CVC</label>
                    <input type="text" name="cvc" value={form.cvc} onChange={e => setForm(f => ({ ...f, cvc: e.target.value }))} maxLength={4} className="w-full px-4 py-2 border rounded-lg" placeholder="123" required />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Nombre en la Tarjeta</label>
                  <input type="text" name="cardName" value={form.cardName} onChange={e => setForm(f => ({ ...f, cardName: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" required />
                </div>
                {error && <div className="text-red-600 mb-2">{error}</div>}
                <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-full hover:bg-orange-600 transition-colors">Pagar y Confirmar</button>
              </form>
            )}
            {paymentMethod === 'qr' && (
              <div className="flex flex-col items-center">
                <img src="/uploads/promibol-qr.jpg" alt="QR Promibol" className="w-56 h-56 object-contain mb-4 border-4 border-yellow-400 rounded-xl shadow-lg" />
                <p className="text-lg text-gray-700 mb-4">Escanea este código QR con tu app bancaria para realizar el pago a Promibol.</p>
                <button
                  className="w-full bg-yellow-400 text-orange-900 font-bold py-3 rounded-full hover:bg-yellow-300 transition-colors mb-2"
                  onClick={handlePay}
                  disabled={processing}
                >
                  Ya pagué
                </button>
                {error && <div className="text-red-600 mb-2">{error}</div>}
              </div>
            )}
            {processing && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400 mb-4"></div>
                <p className="text-lg text-gray-700">Procesando pago...</p>
              </div>
            )}
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-green-500 text-6xl mb-4">✔️</div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">¡Reserva Confirmada!</h2>
            <p className="text-gray-700 mb-4">Recibirás tu entrada por email. ¡Disfruta el evento!</p>
            <button onClick={closeAndReset} className="bg-orange-500 text-white font-bold px-8 py-3 rounded-full hover:bg-orange-600 transition-colors">Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventBookingModal; 