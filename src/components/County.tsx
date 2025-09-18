import type { Feature, GeoJsonProperties, Geometry } from "geojson";
import { counties } from "~/data/counties";
import { getColor } from "~/data/functions";
import { useAppStore } from "~/data/store";

type Props = {
	d: Feature<Geometry, GeoJsonProperties>;
	path: string | null;
};

export const County = ({ d, path }: Props) => {
	const { hi, hi_val, pv, pv_val, c, c_val, age, age_val, setSelectedCounty } = useAppStore();

	const name = d.properties?.ADMIN;
	const county_id = d.id;
	const county = counties.find((x) => x.county_id === Number(county_id));

	const filterValues = {
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

	const onClick = () => {
		const countyObj = counties.find((x) => x.county_id === Number(county_id));
		setSelectedCounty(countyObj || null);
	};

	return (
		// biome-ignore lint/a11y/useSemanticElements: this must be an svg path element
		<path
			role="button"
			tabIndex={0}
			aria-label={name}
			d={path ? path : undefined}
			fill={color}
			strokeWidth="0.3"
			stroke="#090821"
			onClick={onClick}
		/>
	);
};
