import mongoose from "mongoose";

const dimensionSchema = new mongoose.Schema(
  {
    length: {
      unit: String,
      value: Number,
    },
    width: {
      unit: String,
      value: Number,
    },
    height: {
      unit: String,
      value: Number,
    },
    weight: {
      unit: String,
      value: Number,
    },
  },
  { _id: false }
);

const bookSchema = new mongoose.Schema(
  {
    title: String,
    title_long: String,
    authors: [String],
    publisher: String,
    date_published: String,
    pages: Number,
    synopsis: String,
    language: String,
    image: String,
    image_original: String,
    edition: String,
    binding: String,
    isbn: String,
    isbn10: String,
    isbn13: String,
    msrp: Number,
    subjects: [String],
    dewey_decimal: [String],
    dimensions: String,
    dimensions_structured: dimensionSchema,
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
