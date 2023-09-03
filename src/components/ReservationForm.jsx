import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../features/courseSlice';
import '../styles/ReservationForm.css';

const ReservationForm = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const { courses } = useSelector((state) => state.courses);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [formData, setFormData] = useState({
    course_name: '', // Use this to store the selected course name
    reservation_date: '',
    price: '',
    user_id: '1',
  });

  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0]); // Select the first course when courses are available
    }
  }, [courses, selectedCourse]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Find the selected course object
    const course = courses.find((course) => course.name === value);

    setSelectedCourse(course); // Update the selected course

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if a course is selected
    if (!selectedCourse) {
      // console.error('Please select a course');
      return;
    }

    formData.course_id = selectedCourse.id; // Assign the selected course's ID

    try {
      const response = await fetch(`http://127.0.0.1:3001/api/v1/courses/${formData.course_id}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reservation was successfully created
        // console.log('Reservation created successfully');
        // You can reset the form or redirect the user as needed
      } else {
        // Handle errors here
        // console.error('Failed to create reservation');
      }
    } catch (error) {
      // console.error('Error:', error);
    }
  };

  return (
    <div className="reservation-container">
      <h2>Reservation Form</h2>
      <form className="reservation-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <p className="course_name">Select a Course:</p>
          <select
            id="course_name"
            name="course_name"
            value={formData.course_name}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <p className="reservation_date">Select Reservation Date:</p>
          <input
            type="date"
            id="reservation_date"
            name="reservation_date"
            value={formData.reservation_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <p className="price">Price:</p>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">Submit Reservation</button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
