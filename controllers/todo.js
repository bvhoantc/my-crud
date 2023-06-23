exports.index = {
  json: async function (req, res) {
      try {
        let query = {};
        var page = _.has(req.query, 'page') ? parseInt(req.query.page) : 1;
        var limit = _.has(req.query, 'limit') ? parseInt(req.query.limit) : 10;
        if (req.query.title) query.title = req.query.title;
        if (req.query.complete) query.complete = Number(req.query.complete)
        
        // lấy dữ liệu
        let dataQuery = mongoClient.collection('todos').aggregate([
          { $match: query },
          { $skip: ( page - 1 ) * limit},
          { $limit: limit },
        ]);
        
        // lấy tổng số
        let countQuery = mongoClient.collection('todos').aggregate([
          { $match: query },
          { $count: 'total' },
        ]);
        
        let [dataResult, countResult] = await Promise.all([dataQuery.toArray(), countQuery.toArray()]);
        
        let data = dataResult || [];
        let totalResult = countResult[0]?.total || 0;
        
        return res.json({
          code: 200,
          currentPage: page,
          currentRows: limit,
          data: data,
          totalResult: totalResult,
        });
      } catch (error) {
          return res.json({
              code: 500,
              message: error.message? error.message : error
          })
      }
  },
  html: async function (req, res) {
      try {
          _.render(req, res, 'todo', {
              title: 'To do',
              plugins: [['bootstrap-select']],
          }, true);
      } catch (error) {
          return res.json({
              code: 500,
              message: error.message? error.message : error
          })
      }
  }
}

exports.create = async function (req, res){
    try {
        console.log("req",req.body);
        let data = await mongoClient.collection('todos').insertOne(req.body)
        res.json({
            code: 200,
            data: data.ops
        })
    } catch (error) {
        
    }
}