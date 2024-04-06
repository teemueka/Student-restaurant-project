const restaurantRow = (restaurant) => {
  const {name, company} = restaurant;
  const newTr = document.createElement('tr');
  newTr.innerHTML = `<td>${name}</td><td>${company}</td>`;
  return newTr;
};

const restaurantModal = (restaurant, menu) => {
  const {name, address, postalCode, city, phone, company} = restaurant;

  let menuHtml = '';

  menuHtml += name ? `<h1>${name}</h1>` : '';
  menuHtml += address ? `<p>${address}</p>` : '';
  menuHtml += postalCode ? `<p>${postalCode}</p>` : '';
  menuHtml += city ? `<p>${city}</p>` : '';
  menuHtml += phone && phone !== '-' ? `<p>${phone}</p>` : '';
  menuHtml += company ? `<p>${company}</p>` : '';

  menu.days.forEach((day) => {
    menuHtml += `<h2>${day.date}</h2>`;
    if (day.courses.length === 0) {
      menuHtml += `<p>No courses available for this day</p>`;
    } else {
      day.courses.forEach((course) => {
        const price = course.price ? ` - Price: ${course.price}` : '';
        const diets = course.diets ? ` - Diets: ${course.diets}` : '';
        const menuItem = `<p>${course.name}${price}${diets}</p>`;
        menuHtml += menuItem;
      });
    }
  });
  return menuHtml;
};

export {restaurantRow, restaurantModal};
