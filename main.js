/*
	Made by @Silaex
*/

const Log = console.log;
const ErrorLog = console.error;
const Table = console.table;
const Result_Div = document.getElementById("result");
const MEMORY_LIMIT_POWER = 32;
const MEMORY_LIMIT = 2**MEMORY_LIMIT_POWER;
const Memory = {};
const Front_Memory = {};
let Stack_Size = 0;

const Float32_P = 23;
const Float64_P = 52

function FloatToBinary(Nb, Precision)
{
	if(InstanceOf(Number, Nb) && InstanceOf(Number, Precision))
	{
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
		if (Precision === Float64_P)
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
	if(InstanceOf(String, Float_Bin) 
		&& InstanceOf(Number, Precision)
	)
	{
		let Final_Float = 0;
		const Negative_Bit = parseInt(Float_Bin[0]) ? -1 : 1;
		let Exponent = "";
		let Mantissa= "";
		let Exponent_Add = 0;
		let WN_Offset = 0;
		const Float_Bin_Length = Float_Bin.length;
		
		if(Precision === Float32_P)
		{
			Exponent_Add = 9;
			Exponent = Float_Bin.substring(1, Exponent_Add);
			Mantissa = Float_Bin.substring(Exponent_Add, Exponent_Add+Precision);
			WN_Offset = BinaryToDecimal(Exponent) - 127;
		}
		else if(Precision === Float64_P)
		{
			Exponent_Add = 12;
			Exponent = Float_Bin.substring(1, Exponent_Add);
			Mantissa = Float_Bin.substring(Exponent_Add, Exponent_Add+Precision);
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

function DisplayAdd(Add)
{ 
	Result_Div.innerHTML += Add;
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
				{
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
	if(Value === undefined)
	{
		Debug.Error(InstanceOfInit, "The value is not defined!");
		return;
	}
	if(InstanceOf(Instance, Value) || Value === null)
	{
		return Value;
	}
	throw Error("Its not the Type/Instance wanted!");
}

function InstancesOfInit(Instances, Data)
{
	if(Data === undefined)
	{
		throw Error(`Data is not set! [Data:${Data}]`);
	}
	if(InstancesOf(Instances, Data) || Data === null)
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

class Debug
{
	static #Logs = [];
	static #Errors = [];
	
	static Error(Error_Hint, Message)
	{
		const _Error = {
			Error_Hint: InstancesOfInit([Object, Function, String], Error_Hint),
			Message: InstanceOfInit(String, Message),
			Stack: new Error().stack
		};
		
		Debug.#Errors.push(_Error);
		
		{
			// Here we prepare the error to be printed and save it in "Logs" array
			let Formatted_Error_String = "";
			Formatted_Error_String += `[Error_Hint]: ${_Error.Error_Hint.name}\n`;
			Formatted_Error_String += `[Message]: ${_Error.Message}\n\n`;
			Formatted_Error_String += `${_Error.Stack}`;
			Formatted_Error_String += "------------------------------\n";
			Debug.#Logs.push(Formatted_Error_String);
		}
	}
	
	static get Errors()
	{	
		return this.#Errors;
	}
	
	static get Log()
	{
		if(Debug.#Logs.length)
		{
			ErrorLog(...Debug.#Logs);
		}
		return;
	}
}

function DecimalToHex(Decimal, Size)
{
	const Binary = DecimalToBin(Decimal);
	return BinaryToHex(Binary, Size);
}

function DecimalToBin(Decimal, Size /* optional */)
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

	if(Size > Binary.length)
	{
		const Length_Diff = Size - Binary.length;

		For(0, Length_Diff, 1, (It) =>
		{
			Binary.push(0);
		});
	}
	
	return Binary.reverse().join("");
}

function BinaryToDecimal(Binary)
{
	return parseInt(BinaryToHex(Binary));
}

function BinaryToHex(Binary, Size /* optional */)
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

	if(Size > Hex.length)
	{
		const Length_Diff = Size - Hex.length;

		For(0, Length_Diff, 1, (It) =>
		{
			Hex += "0";
		});
	}
	
	return "0x" + [...Hex].reverse().join("");
}

const CHAR_SIZE 	= { Min: -128, 				Max: 127 			};
const UCHAR_SIZE 	= { Min: 0, 				Max: 255 			};
const INT_SIZE 		= { Min: -2_147_483_648, 	Max: 2_147_483_647 	};
const UINT_SIZE 	= { Min: 0, 				Max: 4_294_967_295 	};
const SHORT_SIZE 	= { Min: -32_768, 			Max: 32_767 		};
const USHORT_SIZE 	= { Min: 0, 				Max: 65_535 		};

const CHAR_BITS_SIZE 	= 8;
const SHORT_BITS_SIZE 	= 16;
const INT_BITS_SIZE 	= 32;

let Memory_Write_Cursor = 0;

function FrontMemoryAdd(Var)
{
	if(!InstancesOf([CHAR, SHORT, INT], Var))
	{
		Debug.Error(FrontMemoryAdd, "[CHAR, SHORT, INT] One of this Var types please THANKS!");
		return;
	}
	
	Front_Memory[Var._$] = Var;
}

class CHAR {
	#Value;
	#Address
	#Binary
	constructor(Value=0)
	{
		if(Value > CHAR_SIZE.Max || Value < CHAR_SIZE.Min)
		{
			Debug.Error(CHAR, "Out of bound");
			return;
		}
		this.#Value = Value;
		const MAddress = DecimalToHex(Memory_Write_Cursor, MEMORY_LIMIT_POWER/4);
		this.#Binary = Value < 0 ? "1" + DecimalToBin(-Value, CHAR_BITS_SIZE-1) : "0" + DecimalToBin(Value, CHAR_BITS_SIZE-1);
		this.#Address = MAddress;
	}
	get _()
	{
		return this.#Value;
	}
	set _(Value)
	{
		if(InstanceOf(Number, Value) && Value <= CHAR_SIZE.Max && Value >= CHAR_SIZE.Min)
		{
			this.#Value = Value;
			this.#Binary = Value < 0 ? "1" + DecimalToBin(-Value, CHAR_BITS_SIZE-1) : "0" + DecimalToBin(Value, CHAR_BITS_SIZE-1);
			return this.#Value;
		}
		Debug.Error(CHAR, "Bring me a valid Number!!!");
	}
	get _$()
	{
		return this.#Address;
	}
	get Size()
	{
		return CHAR_BITS_SIZE;
	}
	get Binary()
	{
		return this.#Binary;
	}
};
class UCHAR {
	#Value;
	#Address
	#Binary
	constructor(Value=0)
	{
		if(Value > UCHAR_SIZE.Max || Value < UCHAR_SIZE.Min)
		{
			Debug.Error(UCHAR, "Out of bound");
			return;
		}
		this.#Value = Value;
		const MAddress = DecimalToHex(Memory_Write_Cursor, MEMORY_LIMIT_POWER/4);
		this.#Binary =  DecimalToBin(Value, CHAR_BITS_SIZE);
		this.#Address = MAddress;
	}
	get _()
	{
		return this.#Value;
	}
	set _(Value)
	{
		if(InstanceOf(Number, Value) && Value <= UCHAR_SIZE.Max && Value >= UCHAR_SIZE.Min)
		{
			this.#Value = Value;
			this.#Binary =  DecimalToBin(Value, CHAR_BITS_SIZE);
			return this.#Value;
		}
		Debug.Error(UCHAR, "Bring me a valid Number!!!");
	}
	get _$()
	{
		return this.#Address;
	}
	get Size()
	{
		return CHAR_BITS_SIZE;
	}
	get Binary()
	{
		return this.#Binary;
	}
};
class SHORT {
	#Value;
	#Address
	#Binary
	constructor(Value=0)
	{
		if(Value > SHORT_SIZE.Max || Value < SHORT_SIZE.Min)
		{
			Debug.Error(SHORT, "Out of bound");
			return;
		}
		this.#Value = Value;
		const MAddress = DecimalToHex(Memory_Write_Cursor, MEMORY_LIMIT_POWER/4);
		this.#Binary = Value < 0 ? "1" + DecimalToBin(-Value, SHORT_BITS_SIZE-1) : "0" + DecimalToBin(Value, SHORT_BITS_SIZE-1);
		this.#Address = MAddress;
	}
	get _()
	{
		return this.#Value;
	}
	set _(Value)
	{
		if(InstanceOf(Number, Value) && Value <= SHORT_SIZE.Max && Value >= SHORT_SIZE.Min)
		{
			this.#Value = Value;
			this.#Binary = Value < 0 ? "1" + DecimalToBin(-Value, SHORT_BITS_SIZE-1) : "0" + DecimalToBin(Value, SHORT_BITS_SIZE-1);
			return this.#Value;
		}
		Debug.Error(SHORT, "Bring me a valid Number!!!");
	}
	get _$()
	{
		return this.#Address;
	}
	get Size()
	{
		return SHORT_BITS_SIZE;
	}
	get Binary()
	{
		return this.#Binary;
	}
};
class INT {
	#Value;
	#Address
	#Binary
	constructor(Value=0)
	{
		if(Value > INT_SIZE.Max || Value < INT_SIZE.Min)
		{
			Debug.Error(INT, "Out of bound");
			return;
		}
		this.#Value = Value;
		const MAddress = DecimalToHex(Memory_Write_Cursor, MEMORY_LIMIT_POWER/4);
		this.#Binary = Value < 0 ? "1" + DecimalToBin(-Value, INT_BITS_SIZE-1) : "0" + DecimalToBin(Value, INT_BITS_SIZE-1);
		this.#Address = MAddress;
	}
	get _()
	{
		return this.#Value;
	}
	set _(Value)
	{
		if(InstanceOf(Number, Value) && Value <= INT_SIZE.Max && Value >= INT_SIZE.Min)
		{
			this.#Value = Value;
			this.#Binary = Value < 0 ? "1" + DecimalToBin(-Value, INT_BITS_SIZE-1) : "0" + DecimalToBin(Value, INT_BITS_SIZE-1);
			return this.#Value;
		}
		Debug.Error(INT, "Bring me a valid Number!!!");
	}
	get _$()
	{
		return this.#Address;
	}
	get Size()
	{
		return INT_BITS_SIZE;
	}
	get Binary()
	{
		return this.#Binary;
	}
};
// This is what will store characters used depending on their CharCode
// Example: { 97: "a" }
// So it can be used when we access it from the binary memory
const CharactersMemory = {};
class STRING {
	#Value
	#Address
	#Length
	#Binary
	constructor(Value="", Length=null)
	{
		if(!(InstanceOf(String, Value)) || !(InstanceOf(Number, Length)) || Length < 0 || Value.length > Length || Value.length < 0)
		{
			Debug.Error(STRING, "Wrong Initialization");
			return;
		}
		this.#Length = Length;
		this.#Value = Value;
		this.#Binary = null;
		if(Value.charCodeAt(0))
		{
			this.#Address = UChar(Value.charCodeAt(0))._$;
			CharactersMemory[Value.charCodeAt(0)] = Value[0];
		}
		else
		{
			this.#Address = UChar(0)._$;
		}
		For(1, Length, 1, (It) =>
		{
			if(Value.charCodeAt(It))
			{
				CharactersMemory[Value.charCodeAt(It)] = Value[It];
				UChar(Value.charCodeAt(It));
			}
			else
			{
				UChar(0);
			}
		});
	}
	get _()
	{
		return this.#Value;
	}
	set _(Value)
	{
		if(InstanceOf(String, Value) && Value.length <= this.Size)
		{
			const StringDecimalAddress = Number(this._$);
			For(0, this.Size, 1, (It) =>
			{
				const CharacterAddress = DecimalToHex(StringDecimalAddress + (CHAR_BITS_SIZE*It), MEMORY_LIMIT_POWER/4);
				Memory[CharacterAddress]._ = isNaN(Value.charCodeAt(It)) ? 0 : Value.charCodeAt(It);
			});
			this.#Value = Value;
			return this.#Value;
		}
		Debug.Error(STRING, "Bring me a valid String!!!");
	}
	get _$()
	{
		return this.#Address;
	}
	get Size()
	{
		return this.#Length;
	}
	get Binary()
	{
		return this.#Binary;
	}
};

const Float = -56.7;
function Char(Value)
{
	if(!InstanceOf(Number, Value))
	{
		Debug.Error(Char, "Give me a number please!");
		return;
	}
	if(Stack_Size + CHAR_BITS_SIZE > MEMORY_LIMIT)
	{
		Debug.Error(Char, "Stack Overflow!");
		return;
	}
	const C = new CHAR(Value);
	Stack_Size += CHAR_BITS_SIZE;
	Memory_Write_Cursor += CHAR_BITS_SIZE;
	Memory[C._$] = C;

	return C;
}
function UChar(Value)
{
	if(!InstanceOf(Number, Value))
	{
		Debug.Error(UChar, "Give me a number please!");
		return;
	}
	if(Stack_Size + CHAR_BITS_SIZE > MEMORY_LIMIT)
	{
		Debug.Error(UChar, "Stack Overflow!");
		return;
	}
	const UC = new UCHAR(Value);
	Stack_Size += CHAR_BITS_SIZE;
	Memory_Write_Cursor += CHAR_BITS_SIZE;
	Memory[UC._$] = UC;

	return UC;
}
function Short(Value)
{
	if(!InstanceOf(Number, Value))
	{
		Debug.Error(Short, "Give me a number please!");
		return;
	}
	if(Stack_Size + SHORT_BITS_SIZE > MEMORY_LIMIT)
	{
		Debug.Error(Short, "Stack Overflow!");
		return;
	}
	const S = new SHORT(Value);
	Stack_Size += SHORT_BITS_SIZE;
	Memory_Write_Cursor += SHORT_BITS_SIZE;
	Memory[S._$] = S;

	return S;
}
function Int(Value)
{
	if(!InstanceOf(Number, Value))
	{
		Debug.Error(Int, "Give me a number please!");
		return;
	}
	if(Stack_Size + INT_BITS_SIZE > MEMORY_LIMIT)
	{
		Debug.Error(Int, "Stack Overflow!");
		return;
	}
	const I = new INT(Value);
	Stack_Size += INT_BITS_SIZE;
	Memory_Write_Cursor += INT_BITS_SIZE;
	Memory[I._$] = I;

	return I;
}
function GetMemoryBinary()
{
	const Binaries = [];
	const ChunkSize = 4;
	for (let Key in Memory)
	{
		const MBinary = Memory[Key].Binary;
		let ChunksAmount = MBinary.length/ChunkSize;
		For(0, ChunksAmount, 1, (It) =>
		{
			const BIndex = It*ChunkSize;
			Binaries.push(MBinary.substring(BIndex, BIndex+ChunkSize));
		});
		if(ChunksAmount===0) Binaries.push(Memory[Key].Binary);
	}

	return Binaries.join(" ");
}