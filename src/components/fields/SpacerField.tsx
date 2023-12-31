'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { LuSeparatorHorizontal } from 'react-icons/lu';
import * as z from 'zod';
import {
	ElementsType,
	FormElement,
	FormElementInstance
} from '../FormElements';
import useDesigner from '../hooks/useDesigner';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel
} from '../ui/form';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';

const type: ElementsType = 'SpacerField';

const extraAttributes = {
	height: 20,
};

const propertiesFormSchema = z.object({
	height: z.number().min(5).max(200),
});

type PropertiesFormSchemaType = z.infer<typeof propertiesFormSchema>;

export const SpacerFieldFormElement: FormElement = {
	type,
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,
	designerButtonElement: {
		icon: LuSeparatorHorizontal,
		label: 'Spacer',
	},

	construct: (id: string) => ({
		id,
		type,
		extraAttributes,
	}),

	validate: () => true,
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
	const { height } = element.extraAttributes;
	return (
		<div className='flex flex-col gap-2 w-full items-center'>
			<Label className='text-muted-foreground'>Spacer: {height}px</Label>
			<LuSeparatorHorizontal className='h-8 w-8' />
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
			height: element.extraAttributes.height,
		},
	});

	useEffect(() => {
		form.reset(element.extraAttributes);
	}, [element, form]);

	function applyChanges(values: PropertiesFormSchemaType) {
		const { height } = values;
		updateElement(element.id, {
			...element,
			extraAttributes: {
				height,
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
					name='height'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Height (px): {form.watch('height')}</FormLabel>
							<FormControl className='pt-2'>
								<Slider
									defaultValue={[field.value]}
									min={5}
									max={200}
									step={1}
									onValueChange={(value) => {
										field.onChange(value[0]);
									}}
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
}: {
	elementInstance: FormElementInstance;
}) {
	const element = elementInstance as FormElementInstanceWithExtraAttributes;

	const { height } = element.extraAttributes;
	return <div style={{ height, width: '100%' }} />;
}
