const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
	const { username, email, password, role } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);
	try {
		const user = await User.create({
			username, email, password: hashedPassword, role
		});
		res.status(201).json(user);
		
	} catch (err) {
		res.status(500).json({ error: 'Email already exists' });
	}
};

exports.login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if(!user) return res.status(404).json({ error: 'User not found' });

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

	const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

	res.json({
		token,
		user: {
			id: user._id,
			username: user.username,
			role: user.role

		}
	});
};