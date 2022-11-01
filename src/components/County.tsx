import * as d3 from 'd3';

type Props = {
	path: string | null;
	name: string | undefined;
	color: string;
};

export const County = ({ path, name, color }: Props) => {
	return (
		<path
			id={name}
			d={path ? path : undefined}
			fill={color}
			strokeWidth='1'
			stroke='#eaeaea'
			onMouseOver={() => handleMouseOver(name ? name : '')}
			onMouseOut={handleMouseOut}
			onMouseMove={event => handleMouseMove(event)}
		/>
	);
};

d3.select(`body`).append(`div`).attr(`id`, `tooltip`).attr(`style`, `position: absolute; opacity: 0`);

// Show tooltip when hovering over a region
const handleMouseOver = (name: string) => {
	d3.select(`#tooltip`)
		.style(`opacity`, 1)
		.style(`background-color`, `white`)
		.style(`color`, `black`)
		.style(`border-radius`, `0.25rem`)
		.style(`padding`, `0.25rem`)
		.style(`font-weight`, `600`)
		.text(name);
};

// Hide tooltip as mouse leaves region
const handleMouseOut = () => {
	d3.select(`#tooltip`).style(`opacity`, 0);
};

// Get mouse location so tooltip tracks cursor
const handleMouseMove = (event: any) => {
	d3.select(`#tooltip`)
		.style(`left`, `${event.pageX + 10}px`)
		.style(`top`, `${event.pageY + 10}px`);
};
