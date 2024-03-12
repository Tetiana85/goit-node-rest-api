import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465, //25, 2525, 465
  secure: true,
  auth: {
    user: "tetiana.luzhanska@meta.ua",
    pass: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = (data) => {
  const email = { ...data, from: "tetiana.luzhanska@meta.ua" };
  return transport.sendMail(email);
};

// SENGRID

// import sgMail from "@sendgrid/mail";
// import dotenv from "dotenv";

// dotenv.config();

// const { SENDGRID_API_KEY } = process.env;

// sgMail.setApiKey(SENDGRID_API_KEY);

// export const sendEmail = async (data) => {
//   const email = { ...data, from: "luzhanska.tetiana@gmail.com" };
//   await sgMail.send(email);
//   return true;
// };
