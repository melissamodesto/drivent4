import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const booking = await bookingService.getBookings(userId);
    res.status(httpStatus.OK).json(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body;
  const { userId } = req;

  if (!roomId || roomId <= 0 || isNaN(roomId)) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    await bookingService.postBooking(userId, Number(roomId));
    res.status(httpStatus.CREATED);
  } catch (error) {
    if (error.name === "NotFoundError") {
      res.sendStatus(httpStatus.NOT_FOUND);
    }

    res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const roomId = Number(req.body.roomId);
    const bookingId = Number(req.params.bookingId);

    if (!roomId || roomId <= 0 || isNaN(roomId)) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    if (!bookingId || bookingId <= 0 || isNaN(bookingId)) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    await bookingService.updateBooking(userId, Number(roomId), Number(bookingId));
    res.status(httpStatus.OK);
  } catch (error) {
    if (error.name === "NotFoundError") {
      res.sendStatus(httpStatus.NOT_FOUND);
    }

    res.sendStatus(httpStatus.FORBIDDEN);
  }
}
