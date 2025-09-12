import * as d3 from "d3";

import { counties } from "../data/counties";
import { getColor } from "../data/functions";
import { useAppStore } from "../data/store";

type Props = {
	d: any;
	path: string | null;
	clicked: (event: any, d: any) => void;
};

export const County = ({ d, path, clicked }: Props) => {
	const { temp, temp_val, hi, hi_val, pv, pv_val, c, c_val, age, age_val } = useAppStore();

	const name = d.properties.ADMIN;
	const county_id = d.id;
	const county = counties.find((x) => x.county_id === Number(county_id));

	const filterValues = {
		temp,
		temp_val,
		hi,
		hi_val,
		pv,
		pv_val,
		c,
		c_val,
		age,
		age_val,
	};

	const color = county ? getColor(county, filterValues) : `purple`;

	const onClick = (event: any) => {
		clicked(event, d);
	};

	return (
		<path
			id={name}
			onClick={(event) => onClick(event)}
			d={path ? path : undefined}
			fill={color}
			strokeWidth="0.3"
			stroke="#090821"
			onMouseOver={() => handleMouseOver(name ? name : "")}
			onMouseOut={handleMouseOut}
			onMouseMove={(event) => handleMouseMove(event)}
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
