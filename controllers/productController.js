exports.searchProducts = async (req, res) => {
    try {
      const { name, minPrice, maxPrice, brand, minStock, maxStock, rating, sale, page = 1, limit = 10 } = req.query;
  
      const searchConditions = {};
  
      if (name) {
        // Search in both title and category name
        const category = await Category.findOne({ name: new RegExp(name, 'i') });
        searchConditions.$or = [
          { title: new RegExp(name, 'i') }, // Search by title
        ];
  
        if (category) {
          searchConditions.$or.push({ categoryID: category._id }); // Search by category name
        }
      }
  
      if (minPrice || maxPrice) {
        searchConditions.price = {};
        if (minPrice) searchConditions.price.$gte = parseFloat(minPrice);
        if (maxPrice) searchConditions.price.$lte = parseFloat(maxPrice);
      }
  
      if (brand) {
        searchConditions.brand = new RegExp(brand, 'i');
      }
  
      if (minStock || maxStock) {
        searchConditions.stock = {};
        if (minStock) searchConditions.stock.$gte = parseInt(minStock);
        if (maxStock) searchConditions.stock.$lte = parseInt(maxStock);
      }
  
      if (rating) {
        const ratingValue = parseFloat(rating);
        if (!isNaN(ratingValue)) {
          searchConditions.rating = {
            $gte: Math.floor(ratingValue),
            $lte: Math.floor(ratingValue) + 0.9,
          };
        }
      }
  
      if (sale === 'true') {
        searchConditions.discountPercentage = { $exists: true, $ne: null };
      } else if (sale === 'false') {
        searchConditions.discountPercentage = { $exists: false };
      }
  
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);
  
      if (isNaN(pageNumber) || pageNumber <= 0) {
        return res.status(400).send({ error: 'Invalid page number' });
      }
      if (isNaN(pageSize) || pageSize <= 0) {
        return res.status(400).send({ error: 'Invalid limit' });
      }
  
      const skip = (pageNumber - 1) * pageSize;
      const products = await Product.find(searchConditions)
        .populate('categoryID', 'name')
        .skip(skip)
        .limit(pageSize);
  
      const totalProducts = await Product.countDocuments(searchConditions);
      const totalPages = Math.ceil(totalProducts / pageSize);
  
      res.status(200).send({
        products,
        pagination: {
          total: totalProducts,
          pages: totalPages,
          page: pageNumber,
          prev: pageNumber > 1,
          next: pageNumber < totalPages,
        }
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };
  