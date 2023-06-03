{	
	Log("Memory Size:", Number.parseFloat(MEMORY_LIMIT/1_000_000_000).toFixed(3) + "GB");
	Log("OBJECT Memory:", ObjectLog(Memory));
	const MemoryBinary = GetMemoryBinary();
	Log("MemoryBinary:", MemoryBinary || "_NOTHING_");

	const MouseData = {
		MouseDown: false,
		LastClickPosition: { x:0, y:0 },
		CurrentPosition: { x:0, y:0 },
		ElementClicked: null
	};
	window.addEventListener("mousemove", function(e)
	{
		MouseData.CurrentPosition.x = e.x;
		MouseData.CurrentPosition.y = e.y;
	});
	window.addEventListener("click", function(e)
	{
		MouseData.LastClickPosition.x = e.x;
		MouseData.LastClickPosition.y = e.y;
	});

	window.addEventListener("mousedown", function(e)
	{
		if(!MouseData.MouseDown)
		{
			MouseData.MouseDown = true;
		}
	});
	
	window.addEventListener("mouseup", function(e)
	{
		MouseData.MouseDown = false;
	});

	function WindowMouseMoveEventAdd(Callback)
	{
		if(InstanceOf(Function, Callback))
		{
			window.addEventListener("mousemove", Callback);
		}
		else
		{
			Debug.Error(WindowMouseMoveEventAdd, "Please give me a function!!!");
		}
	}

	/**
	 * 
	 * @param {String} Type 
	 * @param {Object} Properties 
	 * @returns {HTMLElement}
	 */
	function CreateHTMLElement(Type, Properties)
	{
		if(!(InstanceOf(String, Type) && InstanceOf(Object, Properties)))
		{
			Debug.Error(CreateHTMLElement, "Give me [Type: String, Properties: Object]");
			return;
		}

		const HTMLEl = document.createElement(Type);
		
		for (const Prop in Properties) {
			HTMLEl[Prop] = Properties[Prop];
		}

		return HTMLEl;
	}

	class _Window {
		#Width
		#Height
		#Title
		#Win
		#WinElements

		constructor(Size = _Array(INT, 2, Int(350), Int(350)), Title = _String("New Window"))
		{
			if(!(InstanceOf(ARRAY, Size) && Size.Type === INT && InstanceOf(STRING, Title)))
			{
				Debug.Error(_Window, "NOT GOOD!");
				return;
			}

			this.#Width = Size.Get(0);
			this.#Height = Size.Get(1);
			this.#Title = Title._;
			
			const WindowColorBase = "#49D";
			const WindowBackgroundColor = "#eee";
			this.#Win = CreateHTMLElement("div", 
			{
				style: `
					position: absolute;
					display: flex;
					flex-direction: column;
					left: ${(DESKTOP.getClientRects()[0].width/2) - (this.#Width._/2)}px;
					top: ${(DESKTOP.getClientRects()[0].height/2) - (this.#Height._/2)}px;
					width: ${this.#Width._}px;
					height: ${this.#Height._}px;
					background: ${WindowBackgroundColor};
					border: solid 1px ${WindowColorBase};
					border-radius: 6px;
					overflow: hidden;
					resize: both;
					`,
			});
			this.#Win.ontransitionend = () => { this.#Win.style.transitionDuration = `0s`; }
			this.#Win.onmouseup = (event) =>
			{
				this.#Width._ = parseInt(event.currentTarget.style.width);
				this.#Height._ = parseInt(event.currentTarget.style.height);
			}

			const TitleBar = CreateHTMLElement("div", 
			{
				style: `
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;
					background: ${WindowColorBase};
					box-sizing: border-box;
					
				`
			});

			// PRENDRE LA DIFF DE LA SOURIS ET LE BORD POUR ENSUITE APPLIQUER LA DIFF DANS LE DEPLACEMENT
			TitleBar.onclick = function(event)
			{
				MouseData.ElementClicked = TitleBar;
				Log(event)
			}
			WindowMouseMoveEventAdd((event) =>
			{
				if(MouseData.ElementClicked === TitleBar && MouseData.MouseDown)
				{
					this.#Win.style.left = `${MouseData.CurrentPosition.x}px`;
					this.#Win.style.top = `${MouseData.CurrentPosition.y}px`;
				}
			});

			const TitleText = CreateHTMLElement("span", 
			{
				style: `
					margin-left: .5rem;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				`,
				textContent: this.#Title,
			});

			const ControlButtonsContainer = CreateHTMLElement("div", 
			{
				style: `
					display: flex;
					background: ${WindowColorBase};
					height: 100%;
					flex-shrink: 0;
				`
			});
			
			const ControlButtonsGeneralStyle = `
				height: 100%;
				width: 36px;
				cursor: pointer;
				transition: .5s;
				padding: .5rem 0;
				text-align: center;
				box-sizing: border-box;
			`;

			const CloseButton = CreateHTMLElement("div", 
			{
				style: ControlButtonsGeneralStyle,
				textContent: "X"
			});
			CloseButton.onmouseover = function() { this.style.backgroundColor = "red"; }
			CloseButton.onmouseleave = function() { this.style.backgroundColor = "transparent"; }
			CloseButton.onclick = () => 
			{
				this.#Win.remove();
			}

			/**
			 * ================ FULL SCREEN PART ======================
			 */
			let IsFullscreen = false;
			let LastPositionAndDimension = {
				Width: this.#Width._,
				Height: this.#Height._,
				x: parseInt(this.#Win.style.left),
				y: parseInt(this.#Win.style.top)
			}
			const FullscreenButton = CreateHTMLElement("div", 
			{
				style: ControlButtonsGeneralStyle + `font-weight: bold;`,
				textContent: "▢"
			});
			FullscreenButton.onmouseover = function() { this.style.backgroundColor = "rgba(255, 255, 255, .5)"; }
			FullscreenButton.onmouseleave = function() { this.style.backgroundColor = "transparent"; }
			FullscreenButton.onmouseup = () => 
			{ 
				IsFullscreen = !IsFullscreen;
				this.#Win.style.transitionDuration = `.1s`;

				if(IsFullscreen)
				{
					this.#Win.style.borderRadius = `0`;
					LastPositionAndDimension = {
						Width: this.#Width._,
						Height: this.#Height._,
						x: parseInt(this.#Win.style.left),
						y: parseInt(this.#Win.style.top)
					}
					this.#Win.style.left = `0px`;
					this.#Win.style.width = `${DESKTOP.getBoundingClientRect().width}px`;
					this.#Win.style.top = `0px`;
					this.#Win.style.height = `${DESKTOP.getBoundingClientRect().height}px`;
					this.#Win.style.resize = `none`;
				}
				else
				{
					this.#Win.style.left = `${LastPositionAndDimension.x}px` ;
					this.#Win.style.width = `${LastPositionAndDimension.Width}px`;
					this.#Win.style.top = `${LastPositionAndDimension.y}px` ;
					this.#Win.style.height = `${LastPositionAndDimension.Height}px`;
					this.#Win.style.borderRadius = `6px`;
					this.#Win.style.resize = `both`;
				}
			}
			/**
			 * ================ END OF FULL SCREEN PART ======================
			 */

			const MinimizeButton = CreateHTMLElement("div", 
			{
				style: ControlButtonsGeneralStyle,
				textContent: "_"
			});
			MinimizeButton.onmouseover = function() { this.style.backgroundColor = "rgba(255, 255, 255, .5)"; }
			MinimizeButton.onmouseleave = function() { this.style.backgroundColor = "transparent"; }

			const ContentContainer = CreateHTMLElement("div", 
			{
				style: `
					width: 100%;
					flex: 1;
					background: ${WindowBackgroundColor};
				`
			});

			AppendElement(ControlButtonsContainer, MinimizeButton);
			AppendElement(ControlButtonsContainer, FullscreenButton);
			AppendElement(ControlButtonsContainer, CloseButton);
			AppendElement(TitleBar, TitleText);
			AppendElement(TitleBar, ControlButtonsContainer);
			AppendElement(this.#Win, TitleBar);
			AppendElement(this.#Win, ContentContainer);

			this.#WinElements = {
				TitleBar,
				TitleText,
				ControlButtonsContainer,
				CloseButton,
				FullscreenButton,
				MinimizeButton,
				ContentContainer,
			}
		}

		set Title(T)
		{
			this.#Title = InstanceOfInit(STRING, T);
			this.#WinElements.TitleText.textContent = this.#Title._;
			return;
		}
		get Win()
		{
			return this.#Win;
		}
		get WinElements()
		{
			return this.#WinElements;
		}
	}

	const W = new _Window(_Array(INT, 2, Int(500), Int(350)));
	Log(W)

	W.Title = _String("This is my title!");

	let LastKeyPressed = null;
	let CtrlKeyPressed = false;
	let AltKeyPressed = false;
	let Text = "";
	const Element = CreateHTMLElement("textarea", { 
		style: `
			background: transparent; 
			width: 100%;
			height: 100%; 
			font-family: TempleOS;
			color: black;
			box-sizing: border-box;
			border: none;
			resize: none;
			padding: 0 !important;
		`,
		innerHTML: "CreateWindow;",
		spellcheck: false,
		onkeydown: function(event) 
		{ 
			Text = this.value;
			LastKeyPressed = event.key;
			
			const TabShortcut = CtrlKeyPressed && LastKeyPressed === " ";
			const RunShortcut = AltKeyPressed && LastKeyPressed === "r";


			if(LastKeyPressed === "Control") CtrlKeyPressed = true;
			if(LastKeyPressed === "Alt") AltKeyPressed = true;

			if(TabShortcut)
			{
				const CaretPosition = this.selectionStart;
				const TabLength = 4;
				const TabText = Array(TabLength).fill(0).map(e => ' ').join("");

				let LeftHalf = Text.substring(0, CaretPosition);
				const RightHalf = Text.substring(CaretPosition);

				LeftHalf += TabText;

				this.value = LeftHalf + RightHalf;
				this.selectionStart = CaretPosition + TabLength;
				this.selectionEnd = CaretPosition + TabLength;
			}

			if(RunShortcut)
			{
				if(Text === "CreateWindow;")
				{
					AppendElement(DESKTOP, W.Win);
				}
			}
		},
		onkeyup: function(event)
		{
			Text = this.value;

			if(event.key === "Control") CtrlKeyPressed = false;
			if(event.key === "Alt") AltKeyPressed = false;
		},
	});


	Log(Element)
	AppendElement(DESKTOP, Element);
}

// Leave it here! Like this we can see the errors!
Debug.Log;