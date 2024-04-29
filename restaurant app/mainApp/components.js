const d = new Date();
const currentDayIndex = (d.getDay() + 6) % 7;

const restaurantModal = (restaurant, menu) => {
  const {name, address, postalCode, city, phone, company} = restaurant;

  let menuHtml = '';

  menuHtml += name ? `<h1>${name}</h1>` : '';
  menuHtml += address ? `<p>${address}</p>` : '';
  menuHtml += postalCode ? `<p>${postalCode}</p>` : '';
  menuHtml += city ? `<p>${city}</p>` : '';
  menuHtml += phone && phone !== '-' ? `<p>${phone}</p>` : '';
  menuHtml += company ? `<p>${company}</p>` : '';

  if (menu.days === undefined) {
    menuHtml += `<h2>Today's menu</h2>`;
    if (menu.courses.length !== 0) {
      menu.courses.forEach((course) => {
        const price = course.price ? ` - Price: ${course.price}` : '';
        const diets = course.diets ? ` - Diets: ${course.diets}` : '';
        const menuItem = `<p>${course.name}${price}${diets}</p>`;
        menuHtml += menuItem;
      });
    } else {
      menuHtml += `<p>No courses available for this day</p>`;
    }
  } else {
    const orderedDays = menu.days
      .slice(currentDayIndex)
      .concat(menu.days.slice(0, currentDayIndex));

    orderedDays.forEach((day) => {
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
  }
  return menuHtml;
};

export {restaurantModal};
