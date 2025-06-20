import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../store/slices/bookingsSlice';
import { showNotification } from '../store/slices/uiSlice';

const validateCardNumber = (number) => /^\d{16}$/.test(number.replace(/\s/g, ''));
const validateExpiry = (expiry) => /^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry);
const validateCVC = (cvc) => /^\d{3,4}$/.test(cvc);

const BookingModal = ({ isOpen, onClose, artistId, artistName }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [form, setForm] = useState({
    eventTitle: '',
    eventDate: '',
    message: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardName: ''
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.eventTitle || !form.eventDate) {
      setError('Por favor, completa el título y la fecha del evento.');
      return;
    }
    setError(null);
    setStep(2);
  };

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
      // Simula el pago y crea la reserva
      await dispatch(createBooking({
        event_title: form.eventTitle,
        event_date: form.eventDate,
        message: form.message,
        artist_id: artistId,
        client_id: user.id,
        status: 'confirmed',
        payment_method: paymentMethod
      }));
      setProcessing(false);
      setStep(3);
      dispatch(showNotification({ type: 'success', message: '¡Reserva confirmada! El artista recibirá tu solicitud.' }));
    }, 2000);
  };

  const closeAndReset = () => {
    setStep(1);
    setForm({ eventTitle: '', eventDate: '', message: '', cardNumber: '', expiry: '', cvc: '', cardName: '' });
    setError(null);
    setProcessing(false);
    setPaymentMethod('card');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
        <button onClick={closeAndReset} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        {step === 1 && (
          <form onSubmit={handleNext}>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Solicitar Servicio a {artistName}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Título del Evento</label>
              <input type="text" name="eventTitle" value={form.eventTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Fecha del Evento</label>
              <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Mensaje para el artista</label>
              <textarea name="message" value={form.message} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" rows={3} placeholder="Cuéntale al artista sobre tu evento..." />
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <button type="submit" className="w-full bg-yellow-400 text-purple-900 font-bold py-3 rounded-full hover:bg-yellow-300 transition-colors">Continuar al Pago</button>
          </form>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Elige tu método de pago</h2>
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                className={`flex-1 py-2 rounded-full font-bold border-2 ${paymentMethod === 'card' ? 'bg-purple-700 text-white border-purple-700' : 'bg-white text-purple-700 border-purple-300'}`}
                onClick={() => setPaymentMethod('card')}
              >
                Tarjeta
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-full font-bold border-2 ${paymentMethod === 'qr' ? 'bg-yellow-400 text-purple-900 border-yellow-400' : 'bg-white text-yellow-700 border-yellow-300'}`}
                onClick={() => setPaymentMethod('qr')}
              >
                Pago por QR
              </button>
            </div>
            {paymentMethod === 'card' && (
              <form onSubmit={handlePay}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Número de Tarjeta</label>
                  <input type="text" name="cardNumber" value={form.cardNumber} onChange={handleChange} maxLength={16} className="w-full px-4 py-2 border rounded-lg" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Expiración (MM/AA)</label>
                    <input type="text" name="expiry" value={form.expiry} onChange={handleChange} maxLength={5} className="w-full px-4 py-2 border rounded-lg" placeholder="08/27" required />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">CVC</label>
                    <input type="text" name="cvc" value={form.cvc} onChange={handleChange} maxLength={4} className="w-full px-4 py-2 border rounded-lg" placeholder="123" required />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Nombre en la Tarjeta</label>
                  <input type="text" name="cardName" value={form.cardName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                </div>
                {error && <div className="text-red-600 mb-2">{error}</div>}
                <button type="submit" className="w-full bg-purple-700 text-white font-bold py-3 rounded-full hover:bg-purple-800 transition-colors">Pagar y Confirmar</button>
              </form>
            )}
            {paymentMethod === 'qr' && (
              <div className="flex flex-col items-center">
                <img src="/uploads/promibol-qr.jpg" alt="QR Promibol" className="w-56 h-56 object-contain mb-4 border-4 border-yellow-400 rounded-xl shadow-lg" />
                <p className="text-lg text-gray-700 mb-4">Escanea este código QR con tu app bancaria para realizar el pago a Promibol.</p>
                <button
                  className="w-full bg-yellow-400 text-purple-900 font-bold py-3 rounded-full hover:bg-yellow-300 transition-colors mb-2"
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
            <p className="text-gray-700 mb-4">El artista recibirá tu solicitud y se pondrá en contacto contigo pronto.</p>
            <button onClick={closeAndReset} className="bg-yellow-400 text-purple-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition-colors">Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal; 