/*
	Made by @Silaex
*/

const Log = console.log;
const ErrorLog = console.error;
const Table = console.table;
const Result_Div = document.getElementById("result");
const _u12bits = 4096;
const Memory = {};

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

function For(Begin_Index, Condition, Increment, Callback)
{
	let Exit = false;
	let Callback_Value = undefined;
	for(let Index=Begin_Index; Index<Condition; Index+=Increment)
	{
		Callback_Value = Callback.apply(null, [Index, Exit]); 
		if (Exit)
		{
			continue;
		}
	}
	
	return Callback_Value;
}

function TypeOf(Type, Value)
{
	if(typeof Type === "string")
	{
		if (Type === "Array")
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
		if (Instance === Object)
		{
			// We check if the Value is not an Array or a Function
			// because it can be recognized as an Object
			if(!TypeOf("Array", Value) && !TypeOf("Function", Value))
			{
				return TypeOf("Object", Value);
			}
			else if(TypeOf("Array", Value))
			{
				return;
			}
		}
		if(Instance === Array)
		{
			return TypeOf(Instance.name, Value);
		}
		if(Instance === String || Instance === Number)
		{
			return TypeOf(Instance.name, Value);
		
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
		return For(0, Instances.length, 1, (It, Exit) =>
		{
			const Instance = Instances[It];
			if (InstanceOf(Instance, Value))
			{
				Exit = true;
				return true;
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
		this.#Type = InstanceOfInit(Object, Type);
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
			const Formatted_Error_String = "";
			Formatted_Error_String._ += `[Error_Hint]: ${_Error.Error_Hint.name}\n`;
			Formatted_Error_String._ += `[Message]: ${_Error.Message}\n\n`;
			Formatted_Error_String._ += `${_Error.Stack}`;
			Formatted_Error_String._ += "------------------------------\n";
			Debug.#Logs._.push(Formatted_Error_String._);
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
}

// Leave it here! Like this we can handle the errors!
Debug.Log;