{
	const A = Int(86);
	Short(-29849);
	const S = new STRING("", 5);
	Log(S._);
	S._ = "asdaæ";
	Log(S._);
	Log(Memory);
	Log(A._);
	DisplayAdd("<u>OBJECT Memory:</u><br><br>" + ObjectLog(Memory));
	const MemoryBinary = GetMemoryBinary();
	Log(MemoryBinary);
	DisplayAdd("<br><br><u>BINARY Memory:</u><br><br>" + MemoryBinary);
}

// Leave it here! Like this we can handle the errors!
Debug.Log;