'use client';

import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdTextFields } from 'react-icons/md';
import * as z from 'zod';
import {
	ElementsType,
	FormElement,
	FormElementInstance,
	SubmitFunction,
} from '../FormElements';
import useDesigner from '../hooks/useDesigner';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

const type: ElementsType = 'TextField';

const extraAttributes = {
	label: 'Text Field',
	helperText: 'Helper Text',
	required: false,
	placeholder: 'Value here...',
};

const propertiesFormSchema = z.object({
	label: z.string().min(2).max(50),
	helperText: z.string().max(200),
	required: z.boolean().default(false),
	placeholder: z.string().max(50),
});

type PropertiesFormSchemaType = z.infer<typeof propertiesFormSchema>;

export const TextFieldFormElement: FormElement = {
	type,
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,
	designerButtonElement: {
		icon: MdTextFields,
		label: 'Text Field',
	},

	construct: (id: string) => ({
		id,
		type,
		extraAttributes,
	}),

	validate: (
		formElement: FormElementInstance,
		currentValue: string
	): boolean => {
		const element = formElement as FormElementInstanceWithExtraAttributes;

		if (element.extraAttributes.required) {
			return currentValue.length > 0;
		}

		return true;
	},
};

type FormElementInstanceWithExtraAttributes = FormElementInstance & {
	extraAttributes: typeof extraAttributes;
};

function DesignerComponent({
	elementInstance,
}: {
	elementInstance: FormElementInstance;
}) {
	const element = elementInstance as FormElementInstanceWithExtraAttributes;
	const { label, required, helperText, placeholder } = element.extraAttributes;
	return (
		<div className='flex flex-col gap-2 w-full'>
			<Label>
				{label}
				{required ? '*' : ''}
			</Label>
			<Input readOnly disabled placeholder={placeholder} />
			{helperText ? (
				<p className='text-muted-foreground text-sm'>{helperText}</p>
			) : null}
		</div>
	);
}

function PropertiesComponent({
	elementInstance,
}: {
	elementInstance: FormElementInstance;
}) {
	const element = elementInstance as FormElementInstanceWithExtraAttributes;
	const { updateElement } = useDesigner();
	const form = useForm<PropertiesFormSchemaType>({
		resolver: zodResolver(propertiesFormSchema),
		mode: 'onBlur',
		defaultValues: {
			label: element.extraAttributes.label,
			helperText: element.extraAttributes.helperText,
			required: element.extraAttributes.required,
			placeholder: element.extraAttributes.placeholder,
		},
	});

	useEffect(() => {
		form.reset(element.extraAttributes);
	}, [element, form]);

	function applyChanges(values: PropertiesFormSchemaType) {
		updateElement(element.id, {
			...element,
			extraAttributes: {
				...values,
			},
		});
	}
	return (
		<Form {...form}>
			<form
				onBlur={form.handleSubmit(applyChanges)}
				onSubmit={(e) => e.preventDefault()}
				className='space-y-3'
			>
				<FormField
					control={form.control}
					name='label'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Label</FormLabel>
							<FormControl>
								<Input
									{...field}
									onKeyDown={(e) => {
										if (e.key === 'Enter') e.currentTarget.blur();
									}}
								/>
							</FormControl>
							<FormDescription>
								The label of the field. <br /> It will be displayed above the
								field.
							</FormDescription>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='placeholder'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Placeholder</FormLabel>
							<FormControl>
								<Input
									{...field}
									onKeyDown={(e) => {
										if (e.key === 'Enter') e.currentTarget.blur();
									}}
								/>
							</FormControl>
							<FormDescription>The placeholder for the field.</FormDescription>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='helperText'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Helper Text</FormLabel>
							<FormControl>
								<Input
									{...field}
									onKeyDown={(e) => {
										if (e.key === 'Enter') e.currentTarget.blur();
									}}
								/>
							</FormControl>
							<FormDescription>
								The helper text of the field. <br /> It will be displayed below
								the field.
							</FormDescription>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='required'
					render={({ field }) => (
						<FormItem className='flex items-center justify-between rounded-lg border p-3 shadow-sm'>
							<div className='space-y-0.5'>
								<FormLabel>Required</FormLabel>
								<FormDescription>If the field is required.</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}

function FormComponent({
	elementInstance,
	submitValue,
	isInvalid,
	defaultValue,
}: {
	elementInstance: FormElementInstance;
	submitValue?: SubmitFunction;
	isInvalid?: boolean;
	defaultValue?: string;
}) {
	const element = elementInstance as FormElementInstanceWithExtraAttributes;

	const [value, setValue] = useState(defaultValue || '');
	const [error, setError] = useState(false);

	useEffect(() => {
		setError(isInvalid === true);
	}, [isInvalid]);

	const { label, required, helperText, placeholder } = element.extraAttributes;
	return (
		<div className='flex flex-col gap-2 w-full'>
			<Label className={cn(error && 'text-red-500')}>
				{label}
				{required ? '*' : ''}
			</Label>
			<Input
				className={cn(error && 'border-red-500')}
				placeholder={placeholder}
				onChange={(e) => setValue(e.target.value)}
				onBlur={(e) => {
					if (!submitValue) return;
					const valid = TextFieldFormElement.validate(element, e.target.value);
					setError(!valid);
					if (!valid) {
						submitValue(element.id, '');
						return;
					}
					submitValue(element.id, e.target.value);
				}}
				value={value}
			/>
			{helperText ? (
				<p
					className={cn(
						'text-muted-foreground text-sm',
						error && 'text-red-500'
					)}
				>
					{helperText}
				</p>
			) : null}
		</div>
	);
}
