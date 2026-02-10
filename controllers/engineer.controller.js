import ERBEngineer from '../models/ERBEngineer.js';

/**
 * CREATE engineer
 */
export const createEngineer = async (req, res) => {
  try {
    const photo = req.file ? `/uploads/engineers/${req.file.filename}` : null;

    const engineer = await ERBEngineer.create({
      ...req.body,
      photo,
    });

    return res.status(201).json({
      message: 'Engineer added successfully',
      data: engineer,
    });
  } catch (error) {
    console.error('createEngineer:', error);
    return res.status(500).json({ message: 'Failed to add engineer' });
  }
};

/**
 * UPDATE engineer
 */
export const updateEngineer = async (req, res) => {
  try {
    const { id } = req.params;

    const engineer = await ERBEngineer.findByPk(id);

    if (!engineer) {
      return res.status(404).json({ message: 'Engineer not found' });
    }

    const photo = req.file
      ? `/uploads/engineers/${req.file.filename}`
      : engineer.photo;

    await engineer.update({
      ...req.body,
      photo,
    });

    return res.status(200).json({
      message: 'Engineer updated successfully',
      data: engineer,
    });
  } catch (error) {
    console.error('updateEngineer:', error);
    return res.status(500).json({ message: 'Failed to update engineer' });
  }
};
