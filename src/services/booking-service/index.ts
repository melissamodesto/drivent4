import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError, forbiddenError } from "@/errors";

async function getBookings(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking) {
    throw notFoundError();
  }
  return booking;
}

async function postBooking(userId: number, roomId: number) {
  if (!roomId) throw notFoundError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const bookings = await bookingRepository.findBookingByRoomId(roomId);

  if (!bookings) throw notFoundError();

  if (bookings.Booking.length >= bookings.capacity) return forbiddenError();

  const booking = await bookingRepository.createBooking(userId, roomId);

  return booking.id;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  if (!roomId || !bookingId) throw notFoundError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const bookings = await bookingRepository.findBookingByRoomId(roomId);

  if (!bookings) throw notFoundError();

  if (bookings.Booking.length >= bookings.capacity) return forbiddenError();

  const booking = await bookingRepository.updateBooking(roomId, bookingId);

  return booking.id;
}

const bookingService = {
  getBookings,
  postBooking,
  updateBooking,
};

export default bookingService;
