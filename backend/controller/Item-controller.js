const Item = require('../model/Item');

const addItem = async (req, res) => {
    const {name, quantity, price} = req.body;

    if(name == undefined || quantity == undefined || price == undefined){
        return res.status(402).json({ error: 'All Fields Name, Quantity and Price must be provided' });
      }
  
      if(name ==="" || quantity === "" || price ===""){
        return res.status(402).json({ error: 'All Fields Name, Quantity and Price must be provided' });
      }

    try {
        const item = new Item({name, quantity, price})
        await item.save();
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating task' });
    }
};

const updateItem = async(req, res) => {
    const itemId = req.params.id;
    const { name, quantity, price } = req.body;

    if(itemId == '' || itemId == null){
      return res.status(403).json({ error: 'Item Id required' });
    }
    if(name == undefined || quantity == undefined || price == undefined){
      return res.status(402).json({ error: 'All Fields Name, Quantity and Price must be provided' });
    }

    if(name ==="" || quantity === "" || price ===""){
      return res.status(402).json({ error: 'All Fields Name, Quantity and Price must be provided' });
    }

    try {
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Task not Found' });
        }

        item.name = name;
        item.quantity = quantity;
        item.price = price;

        await item.save();
        return res.json(item);
    } catch (error) {
        console.error(error);
      res.status(500).json({ error: 'Error Updating Item' });
    }
};

const deleteItem = async(req, res) => {
    const itemId = req.params.id;

    if(itemId == '' || itemId == null){
      return res.status(403).json({ error: 'Item Id required' });
    }

    try {
       const item = await Item.findById(itemId); 
       if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      await Item.findByIdAndDelete(itemId);
      return res.json({message: 'Deleted Successfully'} );

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error Deleting Item' });
    }
}

exports.addItem = addItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;