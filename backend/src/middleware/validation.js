import Joi from "joi";

// Signup Validation Schema
export const signupSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z\s'-]+$/) // only alphabets, spaces, apostrophes, hyphens
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.pattern.base": "Name must only contain alphabets, spaces, hyphens, or apostrophes.",
    }),

  email: Joi.string()
    .email({ tlds: { allow: true } })
    .max(255)
    .lowercase() // normalize emails (case-insensitive)
    .required(),

  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.",
    }),

  gender: Joi.string().valid("male", "female", "other").required(),
});
// Login Validation Schema
export const loginSchema = Joi.object({
  email: Joi.string()
  .email({ tlds: { allow: true } })
  .max(255)
  .lowercase() // normalize
  .required()
  .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
      "string.max": "Email cannot be longer than 255 characters",
    }),
   password: Joi.string()
    .min(5) // stronger security, min length 8
    .max(128) // avoid huge payloads
    // .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])"))
    // // at least one lowercase, uppercase, number, and special char
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password cannot be longer than 128 characters",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character",
    }),
});

// Complete Profile Validation Schema
export const completeProfileSchema = Joi.object({
  age: Joi.number().min(18).max(100).required().positive(),
  interests: Joi.array().items(Joi.string()).required(),
  languages: Joi.array().items(Joi.string()).optional(),
  travelStyle: Joi.array().items(Joi.string()).optional(),
  preferences: Joi.object({
    budget: Joi.string().valid("low", "mid", "high").default("mid"),
    preferredGenders: Joi.array().items(Joi.string()).default(["any"]),
    activityTypes: Joi.array().items(Joi.string()).optional(),
  }).optional(),
   avatar: Joi.string().optional(), 
});


// Validation schema for creating/updating a trip
export const tripValidationSchema = Joi.object({
  creator: Joi.string().hex().length(24).required(), // MongoDB ObjectId
  destination: Joi.string().min(2).max(100).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).required(), // endDate >= startDate
  activities: Joi.array().items(Joi.string().min(1)).default([]),
  openToJoin: Joi.boolean().default(true),
  budget: Joi.string().valid("low", "mid", "high").default("mid"),
  travelStyle: Joi.array().items(Joi.string().min(1)).default([]),
  maxGroupSize: Joi.number().integer().min(1).max(100).default(4).positive(),
  imageUrl: Joi.string().uri().allow("", null), // optional,
  description: Joi.string().allow("").default("No description provided."),

});


// Update trip validation (all fields optional)
export const updateTripValidationSchema = Joi.object({
  destination: Joi.string().min(2).max(100),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")),
  activities: Joi.array().items(Joi.string().min(1)),
  openToJoin: Joi.boolean(),
  budget: Joi.string().valid("low", "mid", "high"),
  travelStyle: Joi.array().items(Joi.string().min(1)),
  maxGroupSize: Joi.number().integer().min(1).max(100).positive(),
  imageUrl: Joi.string().uri().allow("", null),
});
