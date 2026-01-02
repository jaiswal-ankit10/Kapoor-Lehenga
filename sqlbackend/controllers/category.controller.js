import prisma from "../config/prisma.js";

/**
 * ➕ Create Category
 * POST /api/categories
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim().toLowerCase(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }
    next(error);
  }
};

/**
 * 📥 Get All Categories (with SubCategories)
 * GET /api/categories
 */
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subCategories: {
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ✏️ Update Category
 * PUT /api/categories/:id
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim().toLowerCase(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    next(error);
  }
};

/**
 * 🗑️ Delete Category (CASCADE SubCategories)
 * DELETE /api/categories/:id
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    next(error);
  }
};

/* ======================================================
   SUBCATEGORY CONTROLLERS
====================================================== */

/**
 * ➕ Create SubCategory
 * POST /api/categories/:categoryId/subcategories
 */
export const createSubCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "SubCategory name is required",
      });
    }

    const subCategory = await prisma.subCategory.create({
      data: {
        name: name.trim().toLowerCase(),
        categoryId,
      },
    });

    res.status(201).json({
      success: true,
      message: "SubCategory created successfully",
      subCategory,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "SubCategory already exists in this category",
      });
    }
    if (error.code === "P2003") {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    next(error);
  }
};

/**
 * 📥 Get SubCategories by Category
 * GET /api/categories/:categoryId/subcategories
 */
export const getSubCategoriesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const subCategories = await prisma.subCategory.findMany({
      where: { categoryId },
      orderBy: { name: "asc" },
    });

    res.status(200).json({
      success: true,
      subCategories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ✏️ Update SubCategory
 * PUT /api/subcategories/:id
 */
export const updateSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "SubCategory name is required",
      });
    }

    const subCategory = await prisma.subCategory.update({
      where: { id },
      data: {
        name: name.trim().toLowerCase(),
      },
    });

    res.status(200).json({
      success: true,
      message: "SubCategory updated successfully",
      subCategory,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }
    next(error);
  }
};

/**
 * 🗑️ Delete SubCategory
 * DELETE /api/subcategories/:id
 */
export const deleteSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.subCategory.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "SubCategory deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }
    next(error);
  }
};
