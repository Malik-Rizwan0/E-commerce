// utils/apiFeatures.js

class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;         // Mongoose query
        this.queryStr = queryStr;   // Express query string (req.query)
    }

    // 🔍 Search by name or description
    search() {
        const keyword = this.queryStr.keyword
            ? {
                  $or: [
                      { name: { $regex: this.queryStr.keyword, $options: "i" } },
                      { description: { $regex: this.queryStr.keyword, $options: "i" } },
                  ],
              }
            : {};
        console.log("Search keyword:", keyword);
        this.query = this.query.find({ ...keyword });
        return this;
    }

    // 📂 Filtering (category, price range, ratings)
 filter() {
    const queryCopy = { ...this.queryStr };

    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    let filterObj = {};

    Object.keys(queryCopy).forEach((key) => {
        // Check for nested operators like price[gte]
        if (key.includes('[')) {
            const [field, op] = key.split(/\[|\]/); // 'price[gte]' → ['price', 'gte', '']
            if (!filterObj[field]) filterObj[field] = {};
            filterObj[field]['$' + op] = isNaN(queryCopy[key]) ? queryCopy[key] : Number(queryCopy[key]);
        } else {
            filterObj[key] = isNaN(queryCopy[key]) ? queryCopy[key] : Number(queryCopy[key]);
        }
    });

    this.query = this.query.find(filterObj);
    console.log("Final Mongo Filter:", filterObj);

    return this;
}



    // // 📃 Pagination
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.skip(skip).limit(resultPerPage);
        return this;
    }
}

module.exports = ApiFeatures;
