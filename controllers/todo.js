exports.index = {
  json: async function (req, res) {
      try {
        console.log("req");
          var page = _.has(req.query, 'page') ? parseInt(req.query.page) : 1;
          var rows = _.has(req.query, 'rows') ? parseInt(req.query.rows) : 10;
          let query = {}
          let agg = [];
          const data = await _Todo.aggregatePaginate(_Todo.aggregate(agg), { page: page, limit: rows });
          console.log("data",data);
          var paginator = new pagination.SearchPaginator({
              prelink: '/todo',
              current: page,
              rowsPerPage: rows,
              totalResult: data.total
          });

          const newData = data.docs;
          return res.json({
              code: 200,
              currentPage: page,
              currentRows: rows,
              data: newData,
              totalResult: data.total,
              paging: paginator.getPaginationData()
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