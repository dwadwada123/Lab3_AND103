var express = require('express');
var router = express.Router();

//Thêm model
const Distributors = require('../models/distributors');
const Fruits = require('../models/fruits');

//Api thêm distributor
router.post('/add-distributor', async (req, res) => {
    try {
        const data = req.body; // Lấy dữ liệu từ body
        const newDistributors = new Distributors({
            name: data.name
        }); // Tạo một đối tượng mới

        const result = await newDistributors.save(); // Thêm vào database

        if (result) {
            // Nếu thêm thành công
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
            // Nếu thêm không thành công
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
});

//Api thêm fruit
router.post('/add-fruit', async (req, res) => {
    try {
        const data = req.body; // Lấy dữ liệu từ body
        const newfruit = new Fruits({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: data.image,
            description: data.description,
            id_distributor: data.id_distributor
        }); // Tạo một đối tượng mới

        const result = await newfruit.save(); //Thêm vào database

        if (result) {
            // Nếu thêm thành công
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
            // Nếu thêm không thành công
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
});

//Api get danh sách fruit
router.get('/get-list-fruit', async (req, res) => {
    try {
        const data = await Fruits.find().populate('id_distributor'); // Populate để lấy thông tin distributor
        res.json({
            "status": 200,
            "messenger": "Danh sách fruit",
            "data": data
        });
    } catch (error) {
        console.log(error);
    }
});

//Api get fruit theo id
router.get('/get-fruit-by-id/:id', async (req, res) => { // :id là param
    try {
        const { id } = req.params; // Lấy id từ param
        const data = await Fruits.findById(id).populate('id_distributor');
        res.json({
            "status": 200,
            "messenger": "Danh sách fruit",
            "data": data
        });
    } catch (error) {
        console.log(error);
    }
});

//Api get danh sách fruit trong khoảng giá (query)
router.get('/get-list-fruit-in-price', async (req, res) => {
    try {
        const { price_start, price_end } = req.query; // Lấy dữ liệu từ query
        
        const query = { price: { $gte: price_start, $lte: price_end } }; // Điều kiện lọc
        // $gte: Lớn hơn hoặc bằng
        // $lte: Nhỏ hơn hoặc bằng

        const data = await Fruits.find(query, 'name quantity price id_distributor') // Truyền câu điều kiện và chỉ lấy các trường mong muốn
            .populate('id_distributor')
            .sort({ quantity: -1 }) // Sắp xếp giảm dần theo quantity
            .skip(0) // Bỏ qua 0 row
            .limit(2); // Lấy 2 sản phẩm

        res.json({
            "status": 200,
            "messenger": "Danh sách fruit",
            "data": data
        });
    } catch (error) {
        console.log(error);
    }
});

//Api get danh sách fruit có tên bắt đầu bằng 'A' hoặc 'X'
router.get('/get-list-fruit-have-name-a-or-x', async (req, res) => {
    try {
        const query = {
            $or: [
                { name: { $regex: 'T' } }, // Tìm tên có chữ 'T' (theo tài liệu)
                { name: { $regex: 'X' } }  // Tìm tên có chữ 'X'
            ]
        };

        // truyền câu điều kiện, và chỉ lấy các trường mong muốn
        const data = await Fruits.find(query, 'name quantity price id_distributor')
            .populate('id_distributor');

        res.json({
            "status": 200,
            "messenger": "Danh sách fruit",
            "data": data
        });
    } catch (error) {
        console.log(error);
    }
});

//Api cập nhật fruit
router.put('/update-fruit-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params; // Lấy id từ param
        const data = req.body; // Lấy dữ liệu từ body
        
        const updatefruit = await Fruits.findById(id); // Tìm fruit theo id
        let result = null;

        if (updatefruit) {
            // Nếu tìm thấy fruit, tiến hành cập nhật
            updatefruit.name = data.name ?? updatefruit.name;
            updatefruit.quantity = data.quantity ?? updatefruit.quantity;
            updatefruit.price = data.price ?? updatefruit.price;
            updatefruit.status = data.status ?? updatefruit.status;
            updatefruit.image = data.image ?? updatefruit.image;
            updatefruit.description = data.description ?? updatefruit.description;
            updatefruit.id_distributor = data.id_distributor ?? updatefruit.id_distributor;

            result = await updatefruit.save(); // Lưu lại thay đổi
        }

        if (result) {
            // Nếu cập nhật thành công
            res.json({
                "status": 200,
                "messenger": "Cập nhật thành công",
                "data": result
            });
        } else {
            // Nếu không tìm thấy fruit hoặc cập nhật thất bại
            res.json({
                "status": 400,
                "messenger": "Lỗi, Cập nhật không thành công",
                "data": []
            });
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;