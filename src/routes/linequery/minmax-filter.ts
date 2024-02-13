export const minMaxFilterEditor = function (cell, onRendered, success, cancel, editorParams) {
	function buildValues() {
		success({
			start: start.value,
			end: end.value
		});
	}

	function keypress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			buildValues();
		}

		if (e.key === 'Escape') {
			cancel();
		}
	}

	//create and style inputs
	const start = document.createElement('input');
	start.setAttribute('type', 'number');
	start.setAttribute('placeholder', 'Min');
	// start.setAttribute('min', "0");
	// start.setAttribute('max', "100");
	start.style.padding = '4px';
	start.style.width = '50%';
	start.style.boxSizing = 'border-box';

	start.value = cell.getValue();

	const end = start.cloneNode() as HTMLInputElement;
	end.setAttribute('placeholder', 'Max');

	start.addEventListener('change', buildValues);
	// start.addEventListener('blur', buildValues);
	start.addEventListener('keydown', keypress);

	end.addEventListener('change', buildValues);
	// end.addEventListener('blur', buildValues);
	end.addEventListener('keydown', keypress);

	const container = document.createElement('span');
	container.appendChild(start);
	container.appendChild(end);

	return container;
};

//custom max min filter function
export function minMaxFilterFunction<T extends string | number>(
	headerValue: { start: T; end: T },
	rowValue: T
	// rowData,
	// filterParams
) {
	//headerValue - the value of the header filter element
	//rowValue - the value of the column in this row
	//rowData - the data for the row being filtered
	//filterParams - params object passed to the headerFilterFuncParams property

	// console.log({ headerValue, rowValue, rowData, filterParams });
	if (rowValue) {
		if (headerValue.start != '') {
			if (headerValue.end != '') {
				return rowValue >= headerValue.start && rowValue <= headerValue.end;
			} else {
				return rowValue >= headerValue.start;
			}
		} else {
			if (headerValue.end != '') {
				return rowValue <= headerValue.end;
			}
		}
	}

	return true; //must return a boolean, true if it passes the filter.
}
