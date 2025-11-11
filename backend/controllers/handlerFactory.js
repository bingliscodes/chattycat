import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc,
      },
    });
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.destroy({ where: { id: req.params.id } });

    if (!doc) return next(new AppError('No record found with that ID', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
