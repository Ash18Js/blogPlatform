import { getAllTagsQuery } from "../services/tag.service";

export const getAllTags = async (req, res) => {
  try {
    const tags = await getAllTagsQuery();
    res.status(200).json({
      success: true,
      message: "Successfully fetched all tags",
      data: tags,
    });
  } catch (error) {
    console.error("Error fetching all tags:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error in Get All Tags",
    });
  }
};
