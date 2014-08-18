module.exports = function(app) {
  app.get('/test', function(req,res){
    guys = [
      {
        'id'   : 1,
        'name' : 'george'
      },
      {
        'id'   : 2,
        'name' : 'snogg'
      }
    ];
    res.send(guys);
  });

  app.get('/inventory', function(req,res){
    items = [
      {
        'id'   : 1,
        'name' : 'broken stick'
      },
      {
        'id'   : 2,
        'name' : 'rotten egg'
      }
    ];
    res.send(items);
  });

  app.get('/dispatch/:critter_id', function(req,res) {
    console.log('we got: ' + req.params.critter_id);
    var critter_id = req.params.critter_id;
    pool.push(critter_id);
    res.send(guys);
    console.log('pool has' + pool);
  });
}
