import React from 'react';
import { TextFieldFormElement } from './fields/TextField';
import { TitleFieldFormElement } from './fields/TitleField';
import { SubtitleFieldFormElement } from './fields/SubtitleField';
import { ParagraphFieldFormElement } from './fields/ParagraphField';
import { SeparatorFieldFormElement } from './fields/SeparatorField';
import { SpacerFieldFormElement } from './fields/SpacerField';

export type ElementsType =
	| 'TextField'
	| 'TitleField'
	| 'SubtitleField'
	| 'ParagraphField'
	| 'SeparatorField'
	| 'SpacerField';

export type SubmitFunction = (key: string, value: string) => void;

export type FormElement = {
	type: ElementsType;

	designerButtonElement: {
		icon: React.ElementType;
		label: string;
	};

	designerComponent: React.FC<{
		elementInstance: FormElementInstance;
	}>;

	formComponent: React.FC<{
		elementInstance: FormElementInstance;
		submitValue?: SubmitFunction;
		isInvalid?: boolean;
		defaultValue?: string;
	}>;

	propertiesComponent: React.FC<{
		elementInstance: FormElementInstance;
	}>;

	construct: (id: string) => FormElementInstance;

	validate: (formElement: FormElementInstance, currentValue: string) => boolean;
};

export type FormElementInstance = {
	id: string;
	type: ElementsType;
	extraAttributes?: Record<string, any>;
};

type FormElementsType = {
	[key in ElementsType]: FormElement;
};

export const FormElements: FormElementsType = {
	TextField: TextFieldFormElement,
	TitleField: TitleFieldFormElement,
	SubtitleField: SubtitleFieldFormElement,
	ParagraphField: ParagraphFieldFormElement,
	SeparatorField: SeparatorFieldFormElement,
	SpacerField: SpacerFieldFormElement,
};
