export const PlaceToInsert = {
  BEFORE_END: 'beforeEnd',
  BEFORE_BEGIN: 'beforeBegin',
  AFTER_END: 'afterEnd',
  AFTER_BEGIN: 'afterBegin',
};

export const render = (container, child, place) => {
  if (container.getElement) {
    container = container.getElement();
  }

  if (child.getElement) {
    child = child.getElement();
  }

  switch (place) {
    case PlaceToInsert.AFTER_BEGIN:
      container.prepend(child);
      break;
    case PlaceToInsert.BEFORE_END:
      container.append(child);
      break;
  }
};

export const replace = (newChild, oldChild) => {
  if (!oldChild || !newChild) {
    throw new Error('Can\'t replace unexisting elements');
  }

  if (oldChild.getElement) {
    oldChild = oldChild.getElement();
  }

  if (newChild.getElement) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (!parent) {
    throw new Error('Can\'t replace, parent doesn\'t exist');
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!component.getElement) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export const createElement = (template) => {
  const newElement = document.createElement('div');

  newElement.innerHTML = template;

  return newElement.firstChild;
};
