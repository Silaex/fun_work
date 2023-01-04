/*
	Made by @Silaex
*/

const Log = console.log;
const ErrorLog = console.error;
const Table = console.table;
const Result_Div = document.getElementById("result");
const MEMORY_LIMIT = 2**32;
const Memory = {};


const CHAR_SIZE 	= [-128, 			127];
const UCHAR_SIZE 	= [0, 				255];
const INT_SIZE 		= [-2_147_483_648, 	2_147_483_647];
const UINT_SIZE 	= [0, 				4_294_967_295];
const SHORT_SIZE 	= [-32_768, 		32_767];
const USHORT_SIZE 	= [0, 				65,535];

const Float = -56.7;
class Bits
{
	#Bits;
	constructor(Bits_Number)
	{
		this.#Bits = InstanceOfInit(Number, Bits_Number);
	}
	
	get Bits()
	{
		return this.#Bits;
	}
}
const Float32_P = new Bits(23);
const Float64_P = new Bits(52);

function FloatToBinary(Nb, Float_P)
{
	if(InstanceOf(Number, Nb) && InstanceOf(Bits, Float_P))
	{
		const Precision = Float_P.Bits;
		let Final_Binary = "";
		const Integer_Part = parseInt(Nb);
		// Would be nice to not use "Math.abs()"
		const Floating_Part = Math.abs(Nb - Integer_Part);
		let Negative_Bit = (Integer_Part < 0) ? 1 : 0;
				
		let A = Floating_Part;
		let Mantissa = "";
		let Precision_Bit_Counter = 0;
		
		// Convert fraction section to binary
		while(Precision_Bit_Counter < Precision)
		{
			const Result = (A*2);

			if(A > 0)
			{
				if(Result >= 1)
				{
					A = Result-1;
					Mantissa += '1';
				}
				if(Result < 1)
				{
					Mantissa += '0';
					A = Result;
				}
			}
			else
			{
				Mantissa += '0';
			}
			Precision_Bit_Counter++;
		}
		
		// Convert whole number section to binary
		const Whole_Number = DecimalToBin(Negative_Bit ? -Integer_Part : Integer_Part);
		// Join the two together
		const Joined_Parts = [Whole_Number, Mantissa].join(".");
		
		// How many spaces to move binary point
		const Move_Needed = Joined_Parts.split(".")[0].length - 1;
		
		let Exponent = DecimalToBin(127+Move_Needed);
		if (Float_P === Float64_P)
		{
			Exponent = DecimalToBin(1023+Move_Needed);
		}
		
		// Adjust Mantissa
		Mantissa = Joined_Parts.split(".").join("").substring(1, Precision+1);
		
		Final_Binary = `${Negative_Bit}${Exponent}${Mantissa}`
		
		return Final_Binary;
	}
	Debug.Error(FloatToBinary, "GIVE ME SOME NUMBERS IDIOT!!!");
}

function BinaryToFloat(Float_Bin, Precision)
{
	if(InstanceOf(String, Float_Bin) && InstanceOf(Bits, Precision))
	{
		let Final_Float = 0;
		const Negative_Bit = parseInt(Float_Bin[0]) ? -1 : 1;
		let Exponent = "";
		let Mantissa= "";
		let Exponent_Add = 0;
		let WN_Offset = 0;
		
		if(Precision === Float32_P)
		{
			Exponent_Add = 9;
			Exponent = Float_Bin.substring(1, Exponent_Add);
			Mantissa = Float_Bin.substring(Exponent_Add);
			WN_Offset = BinaryToDecimal(Exponent) - 127;
		}
		else if(Precision === Float64_P)
		{
			Exponent_Add = 12;
			Exponent = Float_Bin.substring(1, Exponent_Add);
			Mantissa = Float_Bin.substring(Exponent_Add);
			WN_Offset = BinaryToDecimal(Exponent) - 1023;
		}
		else
		{
			Debug.Error(BinaryToFloat, "MAN! PLEASE USE FLOAT32_P OR FLOAT64_P!");
		}
				
		// So we reproduce the Whole_Number
		const Whole_Number = BinaryToDecimal("1" + Mantissa.substring(0, WN_Offset));
		
		// So we reproduce the Mantissa
		Mantissa = Mantissa.substring(WN_Offset);
		
		// We convert Mantissa as a Number
		let Floating_Number = 0;
		For(1, Mantissa.length+1, 1, (It) =>
		{
			Floating_Number += (2**(-It)) * Mantissa[It-1];
		});
		
		Final_Float = (Whole_Number + Floating_Number) * Negative_Bit;
		Log(Final_Float);
		
		return Final_Float;
	}
	Debug.Error(BinaryToFloat, "GIVE ME A STRING AND A FLOAT PRECISION IDIOT!!!");
}

function DisplayResult(Result)
{ 
	Result_Div.innerHTML = Result;
}

function ObjectLog(Obj)
{
	if(InstanceOf(Object, Obj))
	{
		return JSON.stringify(Obj);
	}
	else
	{
		Debug.Error(ObjectLog, "You must give an Object!");
	}
}

function For(Begin_Index, Max_Count, Increment, Callback)
{
	let When_To_Return = undefined;
	let Callback_Value = undefined;
	for(let Index=Begin_Index; Index<Max_Count; Index+=Increment)
	{
		Callback.apply(
			null,
			[
				Index,
				function () 
				{ 
					return {
						Now(Value)
						{ 
							Callback_Value = Value;
						},
						End(Value)
						{
							if(Index === Max_Count-1)
							{
								Callback_Value = Value;
							}
						}
					} 
				}
			]
		); 
		if(Callback_Value !== undefined)
		{
			return Callback_Value;
		}
	}
}

function TypeOf(Type, Value)
{
	if(typeof Type === "string")
	{
		if (Type.toLowerCase() === "array")
		{
			return Value.constructor.name === Type;
		}
		return typeof Value === Type.toLowerCase();
	}
	throw Error("The Type must be in a string format (use InstanceOf for everything else)");
}

function InstanceOf(Instance, Value)
{
	try
	{
		switch(Instance)
		{
			case Object:
			{
				if(!TypeOf("Function", Value) && !TypeOf("Array", Value))
				{
					return Value instanceof Object;
				}
				return false;
			} break;
			case Function:
			{
				return Value instanceof Function;
			} break;
			case String:
			{
				return TypeOf("String", Value);
			} break;
			case Number:
			{
				return TypeOf("Number", Value);				
			} break;
			case Array:
			{
				return TypeOf("Array", Value);
			} break;
		}
		return Value instanceof Instance;
	}
	catch(e)
	{
		throw Error(e.message);
	}
}

// Useful to check if its the good Type/Instance and init the variable
function InstanceOfInit(Instance, Value)
{
	if(Value === null || Value === undefined)
	{
		Debug.Error(InstanceOfInit, "The value is not defined or null!");
		return;
	}
	if(InstanceOf(Instance, Value))
	{
		return Value;
	}
	throw Error("Its not the Type/Instance wanted!");
}

function InstancesOfInit(Instances, Data)
{
	if(Data === undefined || Data === null)
	{
		throw Error(`Data is not set! [Data:${Data}]`);
	}
	if(InstancesOf(Instances, Data))
	{
		return Data;
	}
	throw Error("No instance matched!");
}

function InstancesOf(Instances, Value)
{
	if(TypeOf("Array", Instances))
	{
		return For(0, Instances.length, 1, (It, Return) =>
		{
			const Instance = Instances[It];
			if (InstanceOf(Instance, Value))
			{
				Return.Now(true);
			}
		});
	}
	return false;
}

function FreeMemory(Data)
{
	if(InstanceOf(Ptr, Data) || InstanceOf(Var, Data))
	{
		Memory[Data._$] = null;
		delete Memory[Data._$];
		return;
	}
	Debug.Error(FreeMemory, "You did not give a Var or a Ptr");
}

function AllocateMemory(Data)
{
	if(InstanceOf(Ptr, Data) || InstanceOf(Var, Data))
	{
		if(Object.keys(Memory).length > _u12bits)
		{
			Debug.Error(AllocateMemory, "Not enough memory!");
			// @TODO: Crash here
		}
		// Here the variable is not used with "new Var()" because
		// its a system function.
		const Memory_Address = DecimalToHex(Object.keys(Memory).length);
		Memory[Memory_Address] = Data;
		return;
	}
	Debug.Error(FreeMemory, "You did not give a Var or a Ptr");
}

class Var
{
	#Type;
	#Value = undefined;
	#Address = null;
	constructor(Type, Value)
	{
		this.#Type = InstanceOfInit(Function, Type);
		this.#Value = InstanceOfInit(Type, Value);
		this.#Address = DecimalToHex(Object.keys(Memory).length);
		Memory[this.#Address] = this;
	}
	
	set _(Value)
	{
		if(InstanceOf(this.#Type, Value))
		{
			this.#Value = Value;
			return;
		}
		throw Error(`Trying to set a ${this.#Type.name} variable with another type`);
	}
	
	get _()
	{
		return this.#Value;
	}
	
	get _T()
	{
		return this.#Type.name;
	}
	
	get _$()
	{
		return this.#Address;
	}
}

// ????WTF????
class Ptr
{
	#Ptr_Address = null;
	#Var_Address = null;
	constructor(Data)
	{
		if(InstanceOf(Var, Data) || InstanceOf(Ptr, Data))
		{
			this.#Var_Address = Data._$;
			this.#Ptr_Address = DecimalToHex(Object.keys(Memory).length);
			Memory[this.#Ptr_Address] = this;
		}
		else
		{
			Debug.Error(Ptr, "You must give a Var or Ptr data");
		}
	}
	
	get _()
	{
		return Memory[this.#Var_Address];
	}
	
	get _$()
	{
		return this.#Ptr_Address;
	}
}

class Debug
{
	static #Logs = new Var(Array, []);
	static #Errors = new Var(Array, []);
	
	static Error(Error_Hint, Message)
	{
		const _Error = {
			Error_Hint: InstancesOfInit([Object, Function, String], Error_Hint),
			Message: InstanceOfInit(String, Message),
			Stack: new Error().stack
		};
		
		Debug.#Errors._.push(_Error);
		
		{
			// Here we prepare the error to be printed and save it in "Logs" array
			let Formatted_Error_String = "";
			Formatted_Error_String += `[Error_Hint]: ${_Error.Error_Hint.name}\n`;
			Formatted_Error_String += `[Message]: ${_Error.Message}\n\n`;
			Formatted_Error_String += `${_Error.Stack}`;
			Formatted_Error_String += "------------------------------\n";
			Debug.#Logs._.push(Formatted_Error_String);
		}
	}
	
	static get Errors()
	{	
		return this.#Errors._;
	}
	
	static get Log()
	{
		if(Debug.#Logs._.length)
		{
			ErrorLog(...Debug.#Logs._);
		}
		return;
	}
}

function DecimalToHex(Decimal)
{
	const Binary = DecimalToBin(Decimal);
	return BinaryToHex(Binary);
}

function DecimalToBin(Decimal)
{
	let Binary = [];
	let Quotient = Decimal;
		
	while (Quotient !== 0)
	{
		Binary.push(Quotient % 2);
		Quotient = parseInt(Quotient / 2);
	}
	
	if(Binary.length === 0)
	{
		Binary.push(0);
	}
	
	return Binary.reverse().join("");
}

function BinaryToDecimal(Binary)
{
	return parseInt(BinaryToHex(Binary));
}

function BinaryToHex(Binary)
{
	const Quartets = [];
	const Binary_Copy = [...Binary].reverse().join("");
	
	For(0, (Binary_Copy.length/4), 1, (It) =>
	{
		Quartets.push(Binary_Copy.slice(4*It, (4*It)+4));
	});
	
	const Hex_Writing = 
	{
		10: 'A',
		11: 'B',
		12: 'C',
		13: 'D',
		14: 'E',
		15: 'F',
	}
	
	let Hex = "";
	For(0, Quartets.length, 1, (It) =>
	{
		const Quartet = Quartets[It];
		let Quartet_Sum = 0;
		For(0, Quartet.length, 1, (It2) =>
		{
			Quartet_Sum += (2**It2)*Quartet[It2];
		});
		
		if (Quartet_Sum > 9)
		{
			Hex += Hex_Writing[Quartet_Sum];
		}
		else
		{
			Hex += Quartet_Sum;
		}
	});
	
	return "0x" + [...Hex].reverse().join("");
}

{
	const Buff = new Var(Object, {});
	For(0, 20, 1, (It) =>
	{
		const V = new Var(Number, It);
		Buff._[V._$] = V._;
	});
	
	BinaryToFloat(FloatToBinary(Float, Float32_P), Float32_P);
}

// Leave it here! Like this we can handle the errors!
Debug.Log;