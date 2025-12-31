const express = require("express");
const router = express.Router();
const {
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  createArticle
} = require("../controllers/articleController.controller.js");

router.get("/",getAllArticles);
router.post("/", createArticle);
router.get("/:id",getArticleById);
router.put("/:id",updateArticle);
router.delete("/:id",deleteArticle);


module.exports = router;
