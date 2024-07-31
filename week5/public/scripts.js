function addItem() {
    const input = document.getElementById('itemInput');
    const itemText = input.value.trim();
    if (itemText === '') {
        alert('Please enter an item.');
        return;
    }

    const itemList = document.getElementById('itemList');

    // Create a new label
    const newItem = document.createElement('div');
    newItem.className = 'item';

    // Create the text node
    const textNode = document.createTextNode(itemText);

    // Create the remove button
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-btn';
    removeButton.onclick = function() {
        itemList.removeChild(newItem);
    };

    // Append text and button to the item
    newItem.appendChild(textNode);
    newItem.appendChild(removeButton);

    // Add the new label to the list
    itemList.appendChild(newItem);

    // Clear the input field
    input.value = '';
}
