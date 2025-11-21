var express = require('express');
var router = express.Router();
const Upload = require('../config/common/upload');
const Users = require('../models/users');
const Transporter = require('../config/common/mail');
const JWT = require('jsonwebtoken');
const SECRETKEY = "FPTPOLYTECHNIC";

const Distributors = require('../models/distributors');
const Fruits = require('../models/fruits');

// Thêm distributor
router.post('/add-distributor', async (req, res) => {
    try {
        const data = req.body;
        const newDistributors = new Distributors({
            name: data.name
        });
        const result = await newDistributors.save();
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
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

// Thêm fruit
router.post('/add-fruit', async (req, res) => {
    try {
        const data = req.body;
        const newfruit = new Fruits({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: data.image,
            description: data.description,
            id_distributor: data.id_distributor
        });
        const result = await newfruit.save();
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
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

// Lấy danh sách fruit
router.get('/get-list-fruit', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    let payload;
    JWT.verify(token, SECRETKEY, async (err, _payload) => {
        if (err instanceof JWT.TokenExpiredError) return res.sendStatus(401);
        if (err) return res.sendStatus(403);
        payload = _payload;
        try {
            const data = await Fruits.find().populate('id_distributor');
            res.json({
                "status": 200,
                "messenger": "Danh sách fruit",
                "data": data
            });
        } catch (error) {
            console.log(error);
        }
    });
});

// Lấy fruit theo id
router.get('/get-fruit-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params;
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

// Lấy fruit theo khoảng giá
router.get('/get-list-fruit-in-price', async (req, res) => {
    try {
        const { price_start, price_end } = req.query;
        const query = { price: { $gte: price_start, $lte: price_end } };
        const data = await Fruits.find(query, 'name quantity price id_distributor')
            .populate('id_distributor')
            .sort({ quantity: -1 })
            .skip(0)
            .limit(2);
        res.json({
            "status": 200,
            "messenger": "Danh sách fruit",
            "data": data
        });
    } catch (error) {
        console.log(error);
    }
});

// Lấy fruit có tên bắt đầu bằng A hoặc X
router.get('/get-list-fruit-have-name-a-or-x', async (req, res) => {
    try {
        const query = {
            $or: [
                { name: { $regex: 'A' } },
                { name: { $regex: 'X' } }
            ]
        };
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

// Cập nhật fruit
router.put('/update-fruit-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatefruit = await Fruits.findById(id);
        let result = null;
        if (updatefruit) {
            updatefruit.name = data.name ?? updatefruit.name;
            updatefruit.quantity = data.quantity ?? updatefruit.quantity;
            updatefruit.price = data.price ?? updatefruit.price;
            updatefruit.status = data.status ?? updatefruit.status;
            updatefruit.image = data.image ?? updatefruit.image;
            updatefruit.description = data.description ?? updatefruit.description;
            updatefruit.id_distributor = data.id_distributor ?? updatefruit.id_distributor;
            result = await updatefruit.save();
        }
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Cập nhật thành công",
                "data": result
            });
        } else {
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

// Xóa fruit theo id
router.delete('/destroy-fruit-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Fruits.findByIdAndDelete(id);
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Xóa thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, Xóa không thành công",
                "data": []
            });
        }
    } catch (error) {
        console.log(error);
    }
});

// Thêm fruit kèm file ảnh
router.post('/add-fruit-with-file-image', Upload.array('image', 5), async (req, res) => {
    try {
        const data = req.body;
        const { files } = req;
        const urlsImage = files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
        const newfruit = new Fruits({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: urlsImage,
            description: data.description,
            id_distributor: data.id_distributor
        });
        const result = await newfruit.save();
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": []
            });
        }
    } catch (error) {
        console.log(error);
    }
});

// Đăng ký user và gửi email
router.post('/register-send-email', Upload.single('avatar'), async (req, res) => {
    try {
        const data = req.body;
        const { file } = req;
        const newUser = Users({
            username: data.username,
            password: data.password,
            email: data.email,
            name: data.name,
            avatar: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        });
        const result = await newUser.save();
        if (result) {
            const mailOptions = {
                from: "tranvuphong05@gmail.com",
                to: result.email,
                subject: "Đăng ký thành công",
                text: "Cảm ơn bạn đã đăng ký",
            };
            await Transporter.sendMail(mailOptions);
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": []
            });
        }
    } catch (error) {
        console.log(error);
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findOne({ username, password });
        if (user) {
            const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: '1h' });
            const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: '1d' });
            res.json({
                "status": 200,
                "messenger": "Đăng nhập thành công",
                "data": user,
                "token": token,
                "refreshToken": refreshToken
            });
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, đăng nhập không thành công",
                "data": []
            });
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
