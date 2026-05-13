import styles from './Dropdown.module.css';
import { useId } from 'react';

interface DropdownOption {
	label: string;
	value: string;
}

interface DropdownProps {
	name: string;
	label: string;
	options: DropdownOption[];
	required?: boolean;
	placeholder?: string;
	defaultValue?: string;
}

export const Dropdown = ({
	name,
	label,
	options,
	required = false,
	placeholder = 'Selecione',
	defaultValue = '',
}: DropdownProps) => {
	const selectId = useId();

	return (
		<div className={styles.container}>
			<label htmlFor={selectId} className={styles.label}>
				<span>{label}</span>
				<select
					className={styles.select}
					id={selectId}
					name={name}
					required={required}
					defaultValue={defaultValue}
				>
					<option value="" disabled={required} hidden={required}>
						{placeholder}
					</option>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</label>
		</div>
	);
};
