exports.index = {
  json: async function (req, res) {
      try {
          var page = _.has(req.query, 'page') ? parseInt(req.query.page) : 1;
          var rows = _.has(req.query, 'rows') ? parseInt(req.query.rows) : 10;
          var query = {};
          let agg = [];
          agg.push({ $match: query });
          const data = await _Todo.aggregatePaginate(_Todo.aggregate(agg), { page: page, limit: rows });
          
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
          let campains = await _Todo.find()
          _.render(req, res, 'todo', {
              title: 'To do',
              campains: campains || [],
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