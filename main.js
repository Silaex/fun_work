/*
	Made by @Silaex
*/

const Log = console.log;
const Table = console.table;
const Result_Div = document.getElementById("result");
const _u12bits = 4096;
const Memory = {};

function DisplayResult(Result)
{ 
	Result_Div.innerHTML = Result;
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
		throw Error(e);
	}
}

// Useful to check if its the good Type/Instance and init the variable
function InstanceOfInit(Instance, Value)
{
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
	throw Error(`No instance matched!`);
}

function InstancesOf(Instances, Value)
{
	if(TypeOf("Array", Instances))
	{
		return For(0, Instances.length, 1, (It, Exit) =>
		{
			const Instance = Instances[It];
			if (Instance === Value || InstanceOf(Instance, Value))
			{
				Exit = true;
				return true;
			}
		});
	}
	return false;
}

class Var
{
	#Type;
	#Value = undefined;
	#Address = null;
	constructor(Type, Value)
	{
		this.#Type = InstancesOfInit([Object], Type);
		this.#Value = InstanceOfInit(Type, Value);
		this.#Address = DecimalToHex(Object.keys(Memory).length);
		Memory[this.#Address] = this;
	}
	
	set _V(Value)
	{
		if(InstanceOf(this.#Type, Value))
		{
			this.#Value = Value;
			return;
		}
		throw Error(`Trying to set a ${this.#Type.name} variable with another type`);
	}
	
	get _V()
	{
		return this.#Value;
	}
	
	get _T()
	{
		return this.#Type.name;
	}
	
	get _A()
	{
		return this.#Address;
	}
}

// ????WTF????
class Memory_Pointer
{
	#Address = null;
	constructor(Variable)
	{
		if(InstanceOf(Var, Variable))
		{
			this.#Address = Variable._A;
			Memory[Object.keys(Memory).length] = this;
		}
		else
		{
			
		}
	}
	
	get _$()
	{
		return Memory[this.#Address];
	}
}

class Debug_Log
{
	#Logs = [];
	
	static get A()
	{
		return " test ";
	}
}

class Array
{
	#Size = 0;
	#length = 0;
	constructor(Size)
	{
		this.#Size = Size;
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
	For(0, 256, 1, (It) =>
	{
		const V = new Var(Number, It);
		Buff._V[V._A] = V._V;
	});
	
	const P_V = new Memory_Pointer("asfoiahf");
	
	DisplayResult(JSON.stringify(Buff._V));
	Log(Debug_Log.A);
}