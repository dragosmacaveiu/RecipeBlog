require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

/**
 * GET /
 * Homepage
 */

exports.homepage = async (req, res) => {
  try {
    const limitNuber = 5;
    const categories = await Category.find({}).limit(limitNuber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNuber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNuber);
    const american = await Recipe.find({ category: "American" }).limit(limitNuber);
    const chinese = await Recipe.find({ category: "Chinese" }).limit(limitNuber);
    const food = { latest, thai, american, chinese };
    res.render("index", {
      title: "Cooking Blog - Home",
      categories,
      food,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occur" });
  }
};

/**
 * GET /categories
 * categories
 */

exports.exploreCategories = async (req, res) => {
  try {
    const limitNuber = 20;
    const categories = await Category.find({}).limit(limitNuber);
    res.render("categories", {
      title: "Cooking Blog - Categories",
      categories,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occur" });
  }
};

/**
 * GET /recipe/:id
 * Recipe
 */
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe", { title: "Cooking Blog - Recipe", recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories/id
 * categories by ID
 */

exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(limitNumber);
    res.render("categories", { title: "Cooking Blog - Categoreis", categoryById });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * POST /search
 * Search
 */

exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render("search", { title: "Cooking Blog - Search", recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-latest
 * Explore Latest
 */
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", { title: "Cooking Blog - Explore Latest", recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-random
 * Explore Random as JSON
 */
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render("explore-random", {
      title: "Cooking Blog - Explore Random",
      recipe,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /submit-recipe
 * Submit Recipe
 */
exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-recipe", {
    title: "Cooking Blog - Submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};

/**
 * POST /submit-recipe
 * Submit Recipe
 */
exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files where uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      });
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/submit-recipe");
  } catch (error) {
    // res.json(error);
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};

/**
 * GET /about
 * About page
 */
exports.about = async (req, res) => {
  res.render("about", {
    title: "Cooking Blog - About",
  });
};
/**
 * GET /contacts
 * Contacts page
 */
exports.contact = async (req, res) => {
  res.render("contact", {
    title: "Cooking Blog - Contact",
  });
};

/**
 * DELETE /recipe/:id
 * Delete Recipe
 */
exports.delete = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findByIdAndDelete(recipeId);
    res.redirect("/");
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /edit/:id
 * Edit Recipe
 */
exports.edit = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("edit", { recipe: recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * PUT /edit/:id
 * Edit Recipe
 */
exports.submitRecipeOnPUT = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files where uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      });
    }
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    (recipe.name = req.body.name),
      (recipe.description = req.body.description),
      (recipe.email = req.body.email),
      (recipe.ingredients = req.body.ingredients),
      (recipe.category = req.body.category),
      (recipe.image = newImageName),
      (recipe = await recipe.save());
    res.redirect(`/recipe/${recipe.id}`);
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};
