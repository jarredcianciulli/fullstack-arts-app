export function renderSelectionsFromArray(array, classes, clickHandler) {
  let container;
  if (array.length === 0) {
    container = <></>;
  } else {
    // Loop through the array and create HTML elements for each item
    container = array.map((item, index) => {
      // Create a paragraph element for each item
      return (
        <div className={classes.formSelection} key={index}>
          <span>{item}</span>
          <div className={classes.removeItem} onClick={(e) => clickHandler(e)}>
            x
          </div>
        </div>
      );
    });
  }
  console.log(array);
  console.log(container);

  // Return the container element containing the generated HTML elements
  return <div>{container}</div>;
}
