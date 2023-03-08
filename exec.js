{
	const I = Int(8596);
	const RO = ReadOnly(I);
	const Arr = ArrayBuilder(INT, 6);
	Log(RO);
	Arr.Add(0, I);
	Log(Arr);
	FreeMemory(I._$);
	
	function Func(ReturnType, ParamTypes, Cb)
	{
		if(!([STRING, CHAR, SHORT, INT, ARRAY, FLOAT, DOUBLE, READONLY].includes(ReturnType)))
		{
			//Error
			Debug.Error(Func, "Not a valid Type");
		}
		
		if(!InstanceOf(ARRAY, ParamTypes))
		{
			//Error
			Debug.Error(Func, "Paramters Type needs to be in an Array");
		}
		
		For(0, ParamTypes.length, 1, (It) =>
		{
			if(!([STRING, CHAR, SHORT, INT, ARRAY, FLOAT, DOUBLE, READONLY].includes(ParamTypes[It])))
			{
				//Error
				Debug.Error(Func, "Not a valid Type");
			}
		});
		
		if(!InstanceOf(Function, Cb))
		{
			//Error
			Debug.Error(Func, "Not a function");
		}
		
		return function Callback(ParamValues)
		{
			
		}
	}
	const A = ArrayBuilder(READONLY, 1);
	Log(A)
	A.Add(0, ReadOnly(A));
	Func(INT, A, ()=>6);
	
	Log(Memory_Write_Cursor);
	DisplayAdd("<u>Memory:</u> " + Number.parseFloat(MEMORY_LIMIT/1_000_000_000).toFixed(3) + "GB<br><br>");
	DisplayAdd("<u>OBJECT Memory:</u><br><br>" + ObjectLog(Memory));
	const MemoryBinary = GetMemoryBinary();
	Log(MemoryBinary);
	DisplayAdd("<br><br><u>BINARY Memory:</u><br><br>" + MemoryBinary);
}

// Leave it here! Like this we can handle the errors!
Debug.Log;