import Contact from "../models/contact.js";

import HttpError from "../helpers/HttpError.js";

import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

export const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const query = { owner };

  if (favorite) {
    query.favorite = favorite === "true";
  }

  const result = await Contact.find(query, "-createdAt -updatedAt", {
    skip,
    limit,
  });
  res.json(result);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findOne({ _id: id, owner: req.user._id });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findOneAndDelete({
    _id: id,
    owner: req.user._id,
  });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

export const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  if (Object.keys(body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }

  const result = await Contact.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    req.body,
    { new: true }
  );
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

export const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const { _id: owner } = req.user;

  const contact = await Contact.findById(id);
  if (!contact) {
    throw HttpError(404, "Contact not found");
  }

  if (contact.owner.toString() !== owner) {
    throw HttpError(403);
  }

  const updatedContact = await Contact.findOneAndUpdate(
    { _id: id, owner },
    { favorite },
    { new: true }
  );

  res.json(updatedContact);
};

const controllers = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};

export default controllers;
